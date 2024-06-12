import { AntDesign } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Camera({closed}:any) {
  const camRef = useRef(null)
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState();
  const [viewPhoto, setViewPhoto] = useState(false)
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

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync()
      setCapturedPhoto(data.uri)
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {
        viewPhoto || <CameraView style={styles.camera} facing={facing}
        
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
            <TouchableOpacity style={styles.button} onPress={() => setViewPhoto(true)}>
              <Image source={{ uri: capturedPhoto }} width={40} height={40} />
            </TouchableOpacity>
          </View>
        </CameraView>

      }
      {
        viewPhoto &&
        <Modal
          animationType='slide'
          transparent={false}
          visible={viewPhoto}>
          <View className='items-end m-5'>
            <TouchableOpacity onPress={() => setViewPhoto(false)}>
              <AntDesign name='close' size={30} />
            </TouchableOpacity>
          </View>
          <View className='flex-1 justify-center items-center m-4'>
            <Image source={{ uri: capturedPhoto }} width={400} height={500} />
          </View>
        </Modal>
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