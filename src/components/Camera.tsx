import { AntDesign, Entypo } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'

export default function Camera({ closed, setFotos }: any) {
  const camRef = useRef(null)
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Permita o acesso a camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function createAlbum(uri: any) {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri)
      await MediaLibrary.createAlbumAsync('pre-cadastro', asset, false);
    } catch (error) {
      console.log('Erro ao escolher ou salvar foto:', error);
    }

  }

  async function takePicture() {
    if (camRef) {
      const { uri } = await camRef.current.takePictureAsync()
      createAlbum(uri)
      setCapturedPhoto(uri)
    }
  }

  async function launchImageLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true
      });
      if (!result.canceled) {
        setFotos(result.assets);
        setCapturedPhoto(result.assets[0].uri);
      }
    } else {
      alert("Permita acesso a sua galeria")
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {
        <CameraView style={styles.camera} facing={facing}
          ref={camRef}>
          <View className='items-end m-5'>
            <TouchableOpacity onPress={() => closed(false)}>
              <AntDesign color={'#fff'} name='close' size={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}><AntDesign name='sync' size={40} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}><AntDesign name='camera' size={40} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={launchImageLibrary}>
              <Entypo name='images' size={40}  color='white'/>
            </TouchableOpacity>
          </View>
        </CameraView>

      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});