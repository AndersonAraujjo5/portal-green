import Images from "@/utils/Images";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text } from "react-native";
import { Image, ScrollView } from "react-native";

type CacherProps = {
    url: string
    width: number
}

const {height} = Dimensions.get('window')

export default function CacherImage({ url, width }: CacherProps) {
    const [modal, setModal] = useState(false)
    const [uri, setUri] = useState<string>();
    Images.getImageStorage(url).then(item => {
        setUri(item)
    })
    return (
        <>
            {
                uri ?
                    <Pressable
                        onLongPress={() => setModal(true)}
                    >
                        <Modal visible={modal}
                        onRequestClose={() => setModal(false)}
                        >
                        
                            <Pressable
                                onPress={() => setModal(false)}
                                style={styles.button}>
                                <AntDesign name="close" size={25} />
                            </Pressable>
                            <ScrollView>
                                <Image
                                    style={styles.image}
                                    width={width -16} height={height-70}
                                    source={{ uri }}
                                    resizeMode="contain"
                                />
                            </ScrollView>
                        </Modal>
                        <Image
                            style={styles.image}
                            width={width / 2} height={200}
                            source={{ uri }}
                            resizeMode="cover"
                        />
                    </Pressable>
                    :
                    <Text>Carregando...</Text>
            }
        </>
    )
}
const styles = StyleSheet.create({
    button:{
        display: 'flex',
        alignItems: 'flex-end',
        padding: 5
    },
    image: {
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 8,
        marginLeft: 8
    }
})