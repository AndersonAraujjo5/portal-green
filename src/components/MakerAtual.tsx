import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Button } from "react-native-elements";
import { View } from "react-native";

export default function MakerAtual() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

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
        alert(`Altitude:${location.coords.altitude} \n\nLatitude${location.coords.latitude}`)
    }

    return (
        <View className="w-1/3 ">
            <Button onPress={handleLocalAtual} title={"localização atual"} />
        </View>
    )
}