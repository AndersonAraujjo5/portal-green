import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { StyleSheet, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import ModalDetalhesCliente from '@/components/ModalDetalhesCliente';
import Cliente from '@/database/Cliente';

export default function page() {
    const [location, setLocation] = useState<number[] | [number, number]>();
    const [onModal, setOnModal] = useState()
    const [typeMap, setTypeMap] = useState<String | StyleURL>(StyleURL.Street);
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id?: string }>();
 
    const clienteData = Cliente.findById(Number(id));

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


            navigation.setOptions({
                title: ""
            })
        
    }, []);


    const handleTypeMap = (styleUrl: string) => {
        setTypeMap(styleUrl)
    }

    if (!clienteData) {
        router.replace('/tabs/clientes')
        return <></>
    }
    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <Mapbox.MapView
                        styleURL={typeMap}
                        rotateEnabled={true}
                        logoEnabled={false}
                        compassEnabled={true}
                        scaleBarEnabled={false}
                        compassPosition={{ top: 80, right: 10 }}
                        onPress={({ geometry }) => {
                            setOnModal(null)
                        }}
                        style={{ flex: 1 }} >
                        <Mapbox.Camera zoomLevel={15}
                            centerCoordinate={clienteData.cordenadas.split(',')}
                            animationMode='none' />
                        <Mapbox.UserLocation
                            visible={true} />
                        <Mapbox.PointAnnotation
                            selected={true}
                            key="pointAnnotation"
                            id="pointAnnotation"
                            onSelected={() => {
                                setOnModal(ModalDetalhesCliente(clienteData))
                            }}
                            coordinate={clienteData.cordenadas.split(',')}
                        />

                    </Mapbox.MapView>
                </View>
                {
                    onModal && <>{onModal}</>
                }
                <CamadaMap setType={handleTypeMap} />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative'
    },
    box: {
        width: "100%",
        height: '100%',
    }
})
