import React, { useState, useRef, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Mapbox from "@/components/MapBox"
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
function MapDownload() {
    const mapRef = useRef(null);
    const [visibleBounds, setVisibleBounds] = useState(null);
  
    // Função para capturar as coordenadas da área visível do mapa
    const captureVisibleBounds = async () => {
       alert("456")
      if (mapRef.current) {
        const bounds = await mapRef.current?.getVisibleBounds();
        console.log(bounds)
        setVisibleBounds(bounds);
      }
    };
  
    // Função para iniciar o download do mapa da área visível
    const downloadMapData = () => {
        captureVisibleBounds();
    
      if (visibleBounds) {
        alert("ola")
        // Aqui você pode implementar a lógica para baixar os dados do mapa para a área visível
        console.log('Baixando dados do mapa para:', visibleBounds);
        // Exemplo de chamada de API fictícia para baixar os dados do mapa
        // fetch(`URL_DA_SUA_API_DE_DOWNLOAD?bounds=${JSON.stringify(visibleBounds)}`)
        //   .then(response => response.json())
        //   .then(data => {
        //     console.log('Dados do mapa baixados:', data);
        //     // Lógica para processar os dados baixados
        //   })
        //   .catch(error => console.error('Erro ao baixar dados do mapa:', error));

        Mapbox.offlineManager.createPack({
            name: "mymapDownload",
            styleURL: Mapbox.StyleURL.Street,
            bounds: visibleBounds,
            minZoom:0,
            maxZoom:20,
            metadata:{
                name:"Offline region"
            }
        },(offlinePack => {
            console.log('Pacote offline criado:', offlinePack)
        }))
      }
    };
  
    return (
      <View style={styles.container}>
        <Mapbox.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={Mapbox.StyleURL.Outdoors}
        >
          <Mapbox.Camera
            zoomLevel={10}
            maxZoomLevel={5}
            minZoomLevel={5}
            centerCoordinate={[-47.1816,  -1.1964]}
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
      zIndex: 1000,
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
