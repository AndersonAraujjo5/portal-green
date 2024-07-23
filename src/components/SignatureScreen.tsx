import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import Signature from 'react-native-signature-canvas';

import RNFS from 'react-native-fs';


const SignatureScreen = () => {
  const signatureRef = useRef();

  const saveSignature = async (signature: any) => {
    if (signature) {
        const base64Data = signature.replace('data:image/png;base64,', '');
      const path = RNFS.DocumentDirectoryPath + '/signature.png';
      console.log(path)
      try {
        await RNFS.writeFile(path, signature, 'base64');
        console.log('Assinatura salva em:', path);
      } catch (error) {
        console.error('Erro ao salvar a assinatura:', error);
      }
    }
  };

  const handleSignature = (t) => {
    saveSignature(t)
    // if (signatureRef.current) {
    //   const signature = signatureRef.current.getSignature();
    //   // Aqui você pode enviar a assinatura para onde precisar (por exemplo, salvar no banco de dados)
    //   console.log(signature);
    // }
  };

  return (
    <View style={{ flex: 1 }}>
      <Signature
        ref={signatureRef}
        onOK={handleSignature}
        descriptionText="Assine aqui"
        clearText="Limpar"
        confirmText="Salvar"
        webStyle="width: 100%; height: 100%;"
      />
    </View>
  );
};

export default SignatureScreen;
