import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Button } from "react-native-elements";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Mapbox from "@/components/MapBox";

export default function MakerPoint() {
    const [location, setLocation] = useState<number[] | [number, number]>();
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
        })();
    }, []);

    if(!location){
        return(
            <View className="flex-1 justify-center items-center">
                <Text>Carregando</Text>
            </View>
        )
    }

    return (

        <View className="flex-1 relative pt-14">
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
        </View>

    )
}