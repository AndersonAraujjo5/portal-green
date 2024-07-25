import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Mapbox from "@/components/MapBox"
import * as Location from 'expo-location'
import CamadaMap, { StyleURL } from '@/components/CamadaMap';
import Loader from '@/components/Loader';
import { useFocusEffect } from 'expo-router';
import { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';

function MapDownload() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState<number[] | [number, number]>();
  const [typeMap, setTypeMap] = useState(StyleURL.Street)
  const [loading, setLoading] = useState(false);
  const [statusDown, setStatusDown] = useState(0);
  const [mapOffline, setMapOffline] = useState();
  const [stateConnect, setStateConnect] = useState(false)
  const { isConnected } = useNetInfo();
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    })();

  }, []);

  const activeMapOffilne = async () => {
    const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
    if (offlinePack) {
      setMapOffline(offlinePack)
      getLocalizacao();
      setStateConnect(true);
      return
    };
    getLocalizacao();
    setStateConnect(true);
  }


  const checkIsOffline = () => {
    if (!isConnected) {
      activeMapOffilne();
    } else {
      axios.get('https://google.com', { timeout: 5000 }).then(e => {
        getLocalizacao();
        setStateConnect(true);
      }).catch(e => {
        activeMapOffilne();
      })
    }
  }

  useFocusEffect(useCallback(() => {
    checkIsOffline();
  }, [isConnected]))


  const handleTypeMap = (styleUrl: string) => {
    setTypeMap(styleUrl)
  }

  const getLocalizacao = async () => {
    try {
      let getLocation = await Location.getCurrentPositionAsync({});
      setLocation([getLocation.coords.longitude, getLocation.coords.latitude])
    } catch (error) {
      getLocalizacao();
    }
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
      alert(`Não foi possivel fazer o download, tente novamente mais tarde, ou entre em contato com o desenvolvedor
        \n\n`+ e)
    }


  };

  if (!stateConnect) {
    return (
      <Loader show={true} />
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
              style={{ flex: 1 }}
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

            <TouchableOpacity style={styles.button} onPress={downloadMapData}>
              <Text style={styles.buttonText}>Baixar Mapa da Área Visível</Text>
            </TouchableOpacity>

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
