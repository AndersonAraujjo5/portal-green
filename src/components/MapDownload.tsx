import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Mapbox from "@/components/MapBox"
import * as Location from 'expo-location'
import CamadaMap, { StyleURL } from '@/components/CamadaMap';
import MapaBD from '@/database/MapaBD';

function MapDownload() {
  const mapRef = useRef(null);
  const [visibleBounds, setVisibleBounds] = useState(null);
  const [location, setLocation] = useState<number[] | [number, number]>();
  const [typeMap, setTypeMap] = useState(StyleURL.Street)


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      handleLocalAtual();
    })();
    const getTypeMap = MapaBD.find().type
    if (getTypeMap) {
      setTypeMap(getTypeMap)
    }
  }, []);

  const handleTypeMap = (styleUrl: string) => {
    MapaBD.add(styleUrl);
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
        }, (offlinePack => {
          console.log('Pacote offline criado:', offlinePack)
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
      <View className='flex-1 justify-center items-center'>
        <Text>Carregando</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={typeMap}
        onMapLoadingError={() => console.log("mapa offilne")}
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
        </TouchableOpacity>
   */}
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
