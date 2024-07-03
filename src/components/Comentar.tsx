import { AntDesign } from "@expo/vector-icons";
import { Image, ScrollView, View } from "react-native";
import { TextInput } from "react-native";
import { Modal, Text } from "react-native";
import { Pressable } from "react-native";
import Camera from "@/components/Camera";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { useNetInfo } from "@react-native-community/netinfo";
import { api } from "@/service/api";
import CadastroBD from "@/database/CadastroBD";
import LoginBD from "@/database/LoginBD";
import Loader from "@/components/Loader";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

type ComentarProps = {
    id: number
    update?: any
}

export default function Comentar({ id, update }: ComentarProps) {
    const [camera, setCamera] = useState(false)
    const [foto, setFoto] = useState(null);
    const [comentario, setComentario] = useState();
    const [isModal, setIsModal] = useState(false);
    const { isConnected } = useNetInfo();
    const [loader, setLoader] = useState(false)
    const handleClosedCamera = () => {
        setCamera(false)
    }

    const adicionarComentario = () =>{
        const cadastros = CadastroBD.getAllCadastros();

        const login = LoginBD.find()?.usuario
        
        if(cadastros){
            cadastros.map(item => {
                if(item.id == id){
                    const comen = {
                        id: item.Comentarios.length,
                        body: comentario,
                        associado: login?.nome,
                        foto: foto ? foto[0].uri : '',
                        url:foto ? foto[0].uri : '',
                        clienteId: id,
                        type:"image"
                    }
                    item.Comentarios.reverse()
                    item.Comentarios.push(comen)
                    item.Comentarios.reverse()

                }
            })
        }
        CadastroBD.addAll(cadastros)
       
    }

    const salvarComentarios = () => {
        const login = LoginBD.find()?.usuario
        const Comentarios = {
            body: comentario,
            associado: login?.nome,
            foto: foto ? foto[0].uri : '',
            url: foto ? foto[0].uri : '',
            clienteId: id,
            type:"image"

        }

        CadastroBD.addComentario(Comentarios)
    }

    const limpar = () => {
        setFoto(null)
        setComentario('')
        setLoader(false)
        alert("Comentario enviado")
       
        if(update){
            update(item => item+1)
        }
    }

    const handleSendComentario = async () => {
        setLoader(true)

        const formData = new FormData();
        if (foto) {
            formData.append('file', {
                uri: foto[0].uri,
                type: foto[0].mimeType,
                name: foto[0].fileName
            })
        }
        formData.append('body', comentario)
        
        if (isConnected) {
            try {
                await api.post(`/v1/cliente/comentario/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                 })
            } catch (e) {
               salvarComentarios();
        
            }
        } else {
            salvarComentarios();
        }

        adicionarComentario();
        limpar()
        router.navigate('tabs/mapa')
    }

    return (
        <>
            <Pressable onPress={() => setIsModal(true)}
                style={styles.buttom}>
                <Text>Comentar</Text>
            </Pressable>
            <Modal
                visible={isModal}
            >
                <Loader show={loader} />
                {
                    camera && <Camera multipleSelection={false} closed={handleClosedCamera} setFotos={setFoto} />
                }

                {
                    camera ||
                    <>
                        <View style={styles.btnClose}>
                            <Pressable onPress={() => setIsModal(false)}>
                                <AntDesign name="close" size={25} />
                            </Pressable>
                        </View>
                        <ScrollView style={{padding: 20}}>
                            <View style={styles.boxInput}>
                                <TextInput
                                defaultValue={comentario}
                                    placeholder="Comentario"
                                    onChangeText={(value) => setComentario(value)}
                                    multiline={true}
                                    numberOfLines={10}
                                    style={styles.input}
                                    />
                            </View>
                            <Pressable
                                style={styles.btnAddImg}
                                onPress={() => setCamera(true)}>
                                <AntDesign color={'white'} name="camera" size={20} />
                                <Text style={{color:'white'}}>Adicionar imagem</Text>
                            </Pressable>


                            {
                                foto &&
                                <View style={styles.img}>
                                    {
                                        foto.map((item, index) => (
                                            <Image
                                                width={300}
                                                height={320}
                                                key={index}
                                                source={{
                                                    uri: item.uri
                                                }}
                                                resizeMode="cover"
                                            />
                                        ))
                                    }
                                </View>
                            }
                        </ScrollView>
                        {
                            (comentario || foto) &&
                            <View style={styles.btnPostar}>
                                <Pressable 
                                    style={{ backgroundColor: Colors.green,
                                        width: '100%',
                                        paddingTop: 12,
                                        paddingBottom: 12,
                                        borderRadius: 8
                                     }}
                                    onPress={handleSendComentario}
                                >
                                    <Text style={styles.btnText}>Postar</Text>
                                </Pressable>
                            </View>
                        }


                    </>
                }
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    buttom:{
        borderWidth: 1,
        marginRight: 12,
        marginLeft: 12,
        padding: 12,
        borderRadius: 9999,
    },
    btnClose:{
        display: 'flex',
        padding: 20,
        alignItems: 'flex-end'
    },
    boxInput:{
        width: '100%',
        height: 96,
        backgroundColor: '#e5e7eb',
        borderRadius: 6, 
        paddingLeft: 8,
        paddingRight: 8
    },
    input:{
        flex: 1,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color:'#374151',
        height: 144,
        justifyContent: 'flex-start',
        textAlignVertical: 'top'
    },
    btnAddImg: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8, 
        borderRadius: 8,
        width: '100%',
        marginTop: 32,
        backgroundColor: Colors.gray
    },
    img: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 40,
        height: 320
    },
    btnPostar:{
        position: 'absolute',
        bottom: 0,
        width:'100%',
        padding: 8,
        backgroundColor: 'white'
    },
    btnText:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    }
})