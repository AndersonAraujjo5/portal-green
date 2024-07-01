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
import Loader from "./Loader";

type ComentarProps = {
    id: number
}

export default function Comentar({ id }: ComentarProps) {
    const [camera, setCamera] = useState(false)
    const [foto, setFoto] = useState(null);
    const [comentario, setComentario] = useState();
    const [isModal, setIsModal] = useState(false);
    const { isConnected } = useNetInfo();
    const [loader, setLoader] = useState(false)
    const handleClosedCamera = () => {
        setCamera(false)
    }

    const salvarComentarios = () => {

        const login = LoginBD.find()?.usuario
        const Comentarios = {
            body: comentario,
            associado: login?.nome,
            foto: foto ? foto[0].uri : '',
            clienteId: id
        }

        CadastroBD.addComentario(Comentarios)
    }

    const limpar = () => {
        setFoto(null)
        setComentario('')
        setLoader(false)
        alert("Comentario enviado")
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
                // api.get('/v1/cliente').then(e=> console.log(e)).catch(e=> console.log(e))
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

        limpar()
      
    }

    return (
        <>
            <Pressable onPress={() => setIsModal(true)}
                className="border-2 mx-3 px-4 py-3 rounded-full">
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
                        <View className="flex p-5 items-end">
                            <Pressable onPress={() => setIsModal(false)}>
                                <AntDesign name="close" size={25} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-5">
                            <View className="w-full h-24 bg-gray-200 rounded-md ps-2 py-2">
                                <TextInput
                                    placeholder="Comentario"
                                    onChangeText={(value) => setComentario(value)}
                                    multiline={true}
                                    numberOfLines={10}
                                    style={{ textAlignVertical: "top" }}
                                    className="flex-1 font-normal text-base text-gray-700 h-36 justify-start " />
                            </View>
                            <Pressable className="flex-row gap-3 justify-center p-2 rounded-lg w-full mt-8"
                                style={{ backgroundColor: Colors.gray }}
                                onPress={() => setCamera(true)}>
                                <AntDesign color={'white'} name="camera" size={20} />
                                <Text className="text-white">Adicionar imagem</Text>
                            </Pressable>


                            {
                                foto &&
                                <View className="w-full flex items-center mt-10 h-80">
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
                            <View className="absolute bottom-0 w-full p-4 bg-white">
                                <Pressable className="w-full py-3 rounded-lg"
                                    style={{ backgroundColor: Colors.green }}
                                    onPress={handleSendComentario}
                                >
                                    <Text className="text-center font-bold text-white">Postar</Text>
                                </Pressable>
                            </View>
                        }


                    </>
                }
            </Modal>
        </>
    )
}