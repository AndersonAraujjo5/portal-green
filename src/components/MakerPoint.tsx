import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Button } from "react-native-elements";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Mapbox from "@/components/MapBox";

export default function MakerPoint() {
    const [isVisible, setIsVisible] = useState(false)
    const [location, setLocation] = useState<number[] | [number, number]>([]);
    const [point, setPoint] = useState<number[] | [number, number]>()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let getLocation = await Location.getCurrentPositionAsync({});
            setLocation([getLocation.coords.longitude, getLocation.coords.latitude])
            console.log(getLocation)
        })();
    }, []);



    return (
        <>
            <View className="w-1/3 ">
                <Button className="" onPress={() => setIsVisible(!isVisible)} title={"Selecionar no Mapa"} />
            </View>

            <View className="flex-1 relative">
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={isVisible}>

                    <View className="flex-1 justify-center content-center">

                        <View className="w-full h-full">

                            <Mapbox.MapView
                                onPress={({ geometry }) => setPoint(geometry.coordinates)}
                                style={{ flex: 1 }} >
                                <Mapbox.Camera zoomLevel={15} centerCoordinate={location} />

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    annotationContainer: {
        width: 30,
        height: 30,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
    },
    annotationFill: {
        width: 30,
        height: 30,
        backgroundColor: 'blue',
        transform: [{ scale: 0.6 }],
        borderRadius: 15,
    },
});