import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Pressable, StyleSheet, View } from "react-native";
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
        <View style={styles.container}>
            <Pressable style={styles.btn}
            onPress={handleLocalAtual}>
                <Entypo name="location-pin" size={20} color={"white"} />
                <Text style={{
                    color: 'white',
                    textAlign: 'center'
                }}>
                    Localização Atual
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '33.33%',
        padding: 4
    },
    btn:{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: 8,
        borderRadius: 8,
        backgroundColor:Colors.gray
    }
})