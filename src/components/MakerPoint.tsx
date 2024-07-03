import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Mapbox from "@/components/MapBox";
import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

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
            <View style={styles.containerBtnSelecionaMap}>
                <Pressable 
                style={styles.btnSelecionarMap}
                 onPress={() => setIsVisible(!isVisible)}>
                    <Entypo name="location" size={20} color={"white"} />
                    <Text style={{
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        Selecinar no Mapa
                    </Text>
                </Pressable>
            </View>

            <View style={styles.containerModal}>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={isVisible}>

                    <View style={styles.modal}>

                        <View style={{
                            width: '100%', 
                            height:'100%'
                        }}>

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
                    <View style={styles.containerClose}>
                        <View style={styles.close}>
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
    containerBtnSelecionaMap:{
        width: '33.33%',
        padding: 4
    },
    btnSelecionarMap:{
        display: 'flex',
        alignItems: 'center',
        width:'100%',
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.gray
    },
    containerModal:{
        flex: 1,
        position: 'relative'
    },
    modal:{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    containerClose:{
        width:'100%',
        position: 'absolute'
    },
    close:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems:'flex-end',
        margin: 5
    }

})