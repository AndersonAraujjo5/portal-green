import Images from "@/utils/Images";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text } from "react-native";
import { Image, ScrollView } from "react-native";

type CacherProps = {
    url: string
    width: number
}
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
                        <Modal visible={modal}>
                            <Pressable
                                onPress={() => setModal(false)}
                                className="flex items-end p-5 ">
                                <AntDesign name="close" size={25} />
                            </Pressable>
                            <ScrollView>
                                <Image
                                    className="my-2 rounded-lg mx-2"
                                    width={width} height={500}
                                    source={{ uri }}
                                    resizeMode="contain"
                                />
                            </ScrollView>
                        </Modal>
                        <Image
                            className=" my-2 rounded-lg mx-2"
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