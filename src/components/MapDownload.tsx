import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Mapbox from "@/components/MapBox"
import * as Location from 'expo-location'
import CamadaMap, { StyleURL } from '@/components/CamadaMap';
import Loader from '@/components/Loader';
import { useFocusEffect } from 'expo-router';
import { addEventListener, useNetInfo } from '@react-native-community/netinfo';

function MapDownload() {
  const mapRef = useRef(null);
  const [visibleBounds, setVisibleBounds] = useState(null);
  const [location, setLocation] = useState<number[] | [number, number]>();
  const [typeMap, setTypeMap] = useState(StyleURL.Street)
  const [loading, setLoading] = useState(false);
  const [statusDown, setStatusDown] = useState(0);
  const [mapOffline, setMapOffline] = useState();
  const { type, isConnected } = useNetInfo();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      handleLocalAtual();
    })();

    const unsubscribe = addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
    
    // Unsubscribe
    unsubscribe();
  }, []);

  useEffect(()=>{
    activeMapOffilne();
  },[isConnected])

  const activeMapOffilne = async () => {
    console.log(isConnected)
    if (!isConnected) {
      const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
      setMapOffline(offlinePack)
    }else{
      setMapOffline(null)
    }
  }
  
  useFocusEffect(() => {
    activeMapOffilne();
  })

  const handleTypeMap = (styleUrl: string) => {
    setTypeMap(styleUrl)
  }

  const handleLocalAtual = async () => {
    let location = await Location.getCurrentPositionAsync({})
    setLocation([location.coords.longitude, location.coords.latitude])
  }


  // Função para capturar as coordenadas da área visível do mapa
  const captureVisibleBounds = async () => {
    if (mapRef.current) {
      const bounds = await mapRef.current?.getVisibleBounds();
      return bounds;
    }
  };

  // Função para iniciar o download do mapa da área visível
  const downloadMapData = async () => {
    setLoading(true)
    setStatusDown(0)
    try {
      const bounds = await captureVisibleBounds()
      const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
      if (offlinePack) await Mapbox.offlineManager.deletePack('mapOffline')

      if (bounds) {
        await Mapbox.offlineManager.createPack({
          name: "mapOffline",
          styleURL: typeMap,
          bounds,
          minZoom: 12,
          maxZoom: 18,
          metadata: {
            name: "Offline region"
          }
        }, ((offlinePack, status) => {
          setStatusDown(status.percentage.toFixed(2))
          if (status.percentage === 100) {
            setLoading(false);
            alert("Mapa baixado com sucesso")
          }
        }), ((offlinePack, error) => {
          setLoading(false);
          alert("Algo deu errado, tente novamente mais tarde.")
        }))
      }
    } catch (e) {
      console.log(e)
      alert(`Não foi possivel fazer o download, tente novamente mais tarde, ou entre em contato com o desenvolvedor
        \n\n`+ e)
    }


  };

  if (!location) {
    return (
      <Loader show={true}/>
    )
  }

  return (
    <View style={styles.container}>
      {
        loading && <Loader show={loading} text={`Baixando ${statusDown}%`} />
      }
      {
        mapOffline ?
          <>
            <Mapbox.MapView
              logoEnabled={false}
              compassEnabled={true}
              scaleBarEnabled={false}
              compassPosition={{ top: 80, right: 10 }}
              rotateEnabled={true}
              styleURL={mapOffline?.metadata._rnmapbox.styleURI}
              style={{flex: 1}}
            >
              <Mapbox.UserLocation visible={true} animated={true} />
              <Mapbox.Camera maxBounds={{
                ne: [mapOffline?.bounds[0], mapOffline?.bounds[1]],
                sw: [mapOffline?.bounds[2], mapOffline?.bounds[3]]
              }}
                minZoomLevel={12}
                maxZoomLevel={18}
                animationMode="none" />
            </Mapbox.MapView>
          </>
          :
          <>
            <Mapbox.MapView
              ref={mapRef}
              logoEnabled={false}
              compassEnabled={true}
              scaleBarEnabled={false}
              compassPosition={{ top: 80, right: 10 }}
              styleURL={typeMap}
              rotateEnabled={true}
              style={styles.map}
            >
              <Mapbox.UserLocation visible={true} animated={true} />
              <Mapbox.Camera
                animationMode='none'
                zoomLevel={12}
                maxZoomLevel={18}
                minZoomLevel={12}
                centerCoordinate={location}
              />
            </Mapbox.MapView>

            {/* Botão para capturar a área visível */}
            {/* <TouchableOpacity className='mb-96' style={styles.button} onPress={captureVisibleBounds}>
          <Text style={styles.buttonText}>Capturar Área Visível</Text>
        </TouchableOpacity> */}

            {/* Botão para iniciar o download do mapa */}
            <TouchableOpacity style={styles.button} onPress={downloadMapData}>
              <Text style={styles.buttonText}>Baixar Mapa da Área Visível</Text>
            </TouchableOpacity>

            {/* Informações da área visível (opcional para depuração) */}
            {visibleBounds && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Área visível do mapa:</Text>
                <Text style={styles.infoText}>Latitude mínima: {visibleBounds[0][1]}</Text>
                <Text style={styles.infoText}>Longitude mínima: {visibleBounds[0][0]}</Text>
                <Text style={styles.infoText}>Latitude máxima: {visibleBounds[1][1]}</Text>
                <Text style={styles.infoText}>Longitude máxima: {visibleBounds[1][0]}</Text>
              </View>
            )}
            <CamadaMap setType={handleTypeMap} />
          </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  infoBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
});
export default MapDownload;
