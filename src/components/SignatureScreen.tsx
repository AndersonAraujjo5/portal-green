import React, { useRef, useState } from 'react';
import { View,  Text, Dimensions, Pressable, Modal } from 'react-native';
import Signature from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';

import RNFS from 'react-native-fs';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const {height} = Dimensions.get('window');

function SignatureScreen({style, assinatura}:any){
  const [visible, setVisible] = useState(false)
  const signatureRef = useRef();

  const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

  const saveSignature = async (base64Image: any) => {
    if (base64Image) {
      try {
          const base64Data = base64Image.replace('data:image/png;base64,', '');
          const name = `${aleatorio()}-assinatura.png`
          let path = `${FileSystem.documentDirectory}${name}`;
          await FileSystem.writeAsStringAsync(path, base64Data, {
              encoding: FileSystem.EncodingType.Base64,
          });
          assinatura([{uri:path, type: 'image/png', name }])
          setVisible(false)
          console.log('Imagem salva com sucesso em:', path);
      } catch (error) {
          console.error('Erro ao salvar imagem:', error);
      }
    }
  };

  const handleSignature = (t:any) => {
    saveSignature(t)
   
  };

  const  styles  =  `.m-signature-pad
     { 
      height:${height -200}px;
    }` ; 

  return (
    <View>
    <Pressable onPress={() => setVisible(!visible)}
        style={style}>
          <FontAwesome name='pencil-square-o' size={20} color={'white'} />
        <Text style={{color: 'white'}}>   Assinatura do cliente</Text>
    </Pressable>

    <Modal style={{ flex: 1 , backgroundColor:"red"}}
    visible={visible}
    animationType='slide'>
      <Pressable style={{padding: 8}}
      onPress={() => setVisible(!visible)}
      >
        <AntDesign name='left' size={25}/>
        </Pressable>
      <Signature
        ref={signatureRef}
        onOK={handleSignature}
        descriptionText="Assine aqui"
        clearText="Limpar"
        confirmText="Salvar"
        webStyle={styles}
        imageType='image/png'
      />
    </Modal>
    </View>
  );
};

export default SignatureScreen;