import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Mapbox from "@/components/MapBox";

export default function MakerPoint({ setLocation }) {
    const [isVisible, setIsVisible] = useState(false)
    const [locationAtual, setLocationAtual] = useState<number[] | [number, number]>([]);
    const [point, setPoint] = useState<number[] | [number, number]>()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let getLocation = await Location.getCurrentPositionAsync({});
            setLocationAtual([getLocation.coords.longitude, getLocation.coords.latitude])
        })();
    }, []);



    return (
        <>
            <View className="w-1/3 p-1">
                <Pressable className="flex items-center w-full bg-gray-300 p-2 rounded-lg"
                 onPress={() => setIsVisible(!isVisible)}>
                    <Entypo name="location" size={20} color={"blue"} />
                    <Text>
                        Selecinar 
                    </Text>
                    <Text>no Mapa</Text>
                </Pressable>
            </View>

            <View className="flex-1 relative">
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={isVisible}>

                    <View className="flex-1 justify-center content-center">

                        <View className="w-full h-full">

                            <Mapbox.MapView
                                onPress={({ geometry }) => {
                                    setPoint(geometry.coordinates)
                                    setLocation(geometry.coordinates)
                                    alert(`Localização selecionada!
                                        \n\n${geometry.coordinates}`)

                                }}
                                style={{ flex: 1 }} >
                                <Mapbox.Camera 
                                zoomLevel={15} 
                                centerCoordinate={locationAtual} 
                                animationMode="none"/>

                                <Mapbox.UserLocation
                                    animated={true}
                                    visible={true} />
                                {point && <Mapbox.PointAnnotation
                                    title="Teste"
                                    snippet="Teste"
                                    selected={true}
                                    key="pointAnnotation"
                                    id="pointAnnotation"
                                    coordinate={point}
                                />}
                            </Mapbox.MapView>
                        </View>
                    </View>
                    <View className="w-full absolute">
                        <View className="flex justify-end items-end m-5">
                            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                                <AntDesign name="close" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    )
}
