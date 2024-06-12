import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Animated } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type CordProps = {
    coordinate: {
        latitude: string
        longitude: string
    }
    cliente: string,
    pppoe: string


}

export default function Map() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [points, setPoints] = useState<CordProps[]>([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            // console.log(location)
        })();
    }, []);

    if (!location) return <View className='flex-1 justify-center items-center'><Text>Carregando</Text></View>

    return (
        <View style={styles.container}>
             
            <MapView
                mapType='hybrid'
                showsUserLocation={true}
                style={styles.map}
                onPress={(e) => {
                    const cord = [...points,{ coordinate: e.nativeEvent.coordinate, pppoe:"teste@greenet.net.br", cliente:"Raimundo castro" }]
                    setPoints(cord)
                }}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {points.map((e,i) => (
                    <Marker
                    key={i}
                    onPress={() => console.log("t") }
                    pinColor='#0a90f7'    
                    coordinate={e.coordinate}
                        title={e.cliente}
                        description={`PPPOE: ${e.pppoe}`} />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 56,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});