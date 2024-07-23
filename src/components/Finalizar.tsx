import { AntDesign } from "@expo/vector-icons";
import { Image, ScrollView, View } from "react-native";
import { TextInput } from "react-native";
import { Modal, Text } from "react-native";
import { Pressable } from "react-native";
import Camera from "@/components/Camera";
import { useState } from "react";
import Colors from "@/constants/Colors";
import LoginBD from "@/database/LoginBD";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
import Cliente from "@/database/Cliente";
import SignatureScreen from "./SignatureScreen";

type ComentarProps = {
    id: number
    update?: any
}

export default function Finalizar({ id, update }: ComentarProps) {
    const [camera, setCamera] = useState(false)
    const [foto, setFoto] = useState(null);
    const [comentario, setComentario] = useState();
    const [isModal, setIsModal] = useState(false);
    const [loader, setLoader] = useState(false)
    const handleClosedCamera = () => {
        setCamera(false)
    }

    const salvarComentarios = () => {
        const associado = LoginBD.find()?.usuario

        Cliente.addComentario(id, {
            body: comentario,
            associado: associado?.nome,
            foto: foto ? foto[0].uri : '',
            url: foto ? foto[0].uri : '',
            clienteId: id,
            type: "image"

        })
    }

    const limpar = () => {
        setFoto(null)
        setComentario('')
        setLoader(false)
        alert("Comentario enviado")

        if (update) {
            update(item => item + 1)
        }

        setIsModal(false)

    }

    const handleSendComentario = async () => {
        setLoader(true)
        salvarComentarios();
        limpar()
    }

    return (
        <>
            <Pressable onPress={() => setIsModal(true)}
                style={styles.buttom}>
                <Text>Finalizar</Text>
            </Pressable>
            <Modal
                visible={isModal}
            >


                <SignatureScreen />
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    buttom: {
        borderWidth: 1,
        marginRight: 12,
        marginLeft: 12,
        padding: 12,
        borderRadius: 9999,
    },
    btnClose: {
        display: 'flex',
        padding: 20,
        alignItems: 'flex-end'
    },
    boxInput: {
        width: '100%',
        height: 96,
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
        paddingLeft: 8,
        paddingRight: 8
    },
    input: {
        flex: 1,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
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
    btnPostar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 8,
        backgroundColor: 'white'
    },
    btnText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    }
})