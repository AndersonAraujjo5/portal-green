import Images from "@/utils/Images";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Image, View } from "react-native";

type CacherProps = {
    url: string
    width: number
}
export default function CacherImage({ url, width }: CacherProps) {
    const [uri, setUri] = useState<string>();
    Images.getImageStorage(url).then(item => {
        console.log(item)
        setUri(item)
    })
    return (
        <>
            {
                uri ?
                    <Image
                        className=" my-2 rounded-lg mx-2"
                        width={width / 2} height={200}
                        source={{ uri }}
                        resizeMode="cover"
                    />
                    :
                    <Text>Carregando...</Text>
        }
        </>
    )
}