import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Button } from "react-native-elements";
import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function MakerAtual({setLocaction}) {
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    const handleLocalAtual = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocaction([location.coords.longitude, location.coords.latitude])
        alert(`Localização atual selecionada!\n\n${location.coords.longitude},${location.coords.latitude}`)
    }

    return (
        <View className="w-1/3 p-1">
            <Pressable className="flex items-center w-ful p-2 rounded-lg"
            style={{backgroundColor:Colors.gray}} onPress={handleLocalAtual}>
                <Entypo name="location-pin" size={20} color={"white"} />
                <Text className="text-white text-center">
                    Localização Atual
                </Text>
            </Pressable>
        </View>
    )
}