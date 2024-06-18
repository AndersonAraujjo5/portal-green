import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Button } from "react-native-elements";
import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

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
        setLocaction([location.coords.latitude, location.coords.longitude])
        console.log(`https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`)
        alert(`Localização atual selecionada!\n\n${location.coords.latitude},${location.coords.longitude}`)
    }

    return (
        <View className="w-1/3 p-1">
            <Pressable className="flex items-center w-full bg-gray-300 p-2 rounded-lg" onPress={handleLocalAtual}>
                <Entypo name="location-pin" size={20} color={"blue"} />
                <Text>
                    Localização
                </Text>
                <Text>Atual</Text>
            </Pressable>
        </View>
    )
}