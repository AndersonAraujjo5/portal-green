import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Loader from "@/components/Loader";

export default function MakerAtual({setLocaction}) {
    const [isLoad, setIsLoad] = useState(false)
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
        setIsLoad(true)
        let location = await Location.getCurrentPositionAsync({});
        setLocaction([location.coords.longitude, location.coords.latitude])
        setIsLoad(false)
        alert(`Localização atual selecionada!\n\n${location.coords.longitude},${location.coords.latitude}`)
    }

    if(isLoad){
        return<View style={styles.container}>
        <Pressable style={styles.btn}
        onPress={handleLocalAtual}>
            <ActivityIndicator size={60} color={Colors.green} />
            <Text style={{
                color: 'white',
                textAlign: 'center'
            }}>
                Aguarde...
            </Text>
        </Pressable>
    </View>
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