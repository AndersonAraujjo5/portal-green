import { useCallback, useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Mapbox from "@/components/MapBox";
import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";

export default function MakerPoint({ setLocation }) {
    const [isVisible, setIsVisible] = useState(false)
    const [locationAtual, setLocationAtual] = useState<number[] | [number, number]>([]);
    const [point, setPoint] = useState<number[] | [number, number]>()
    const [msg, setMsg] = useState(null)
    const { isConnected } = useNetInfo();
    const [mapOffline, setMapOffline] = useState();


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

        })();
    }, []);


    const getLocalizacao = async () => {
        let getLocation = await Location.getCurrentPositionAsync({});
        setLocationAtual([getLocation.coords.longitude, getLocation.coords.latitude])
    }

    const activeMapOffilne = async () => {
        const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
        console.log("offilepack", offlinePack)
        if (offlinePack) {
            setMapOffline(offlinePack)
            getLocalizacao();
            setMsg(null)
            return
        };
        getLocalizacao();
        setMsg(`Você não tem mapa baixado, para utilizar offline!\nClick no seu perfil e depois em baixar mapa, escolha  area que deseja e aperte no botão baixar`)
    }

    const checkIsOffline = () => {
        setMsg(null)
        if (!isConnected) {
            activeMapOffilne();
        } else {
            axios.get('https://google.com', { timeout: 5000 }).then(e => {
                getLocalizacao();
            }).catch(e => {
                activeMapOffilne();
                console.log("sem internet")

            })
        }
    }

    useFocusEffect(useCallback(() => {
        checkIsOffline();       
    }, [isConnected]))



    return (
        <>
            <View style={styles.containerBtnSelecionaMap}>
                <Pressable
                    style={styles.btnSelecionarMap}
                    onPress={() => {
                        setIsVisible(!isVisible);
                        checkIsOffline();
                    }}>
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
                            height: '100%'
                        }}>
                            {
                                msg &&
                                <View style={{ flex: 1, justifyContent: "center", padding: 12 }}>
                                    <Text style={{
                                        fontSize: 20,
                                        lineHeight: 28,
                                    }}>{msg}</Text>
                                </View>
                            }

                            {
                                !msg &&
                                mapOffline &&
                                <Mapbox.MapView
                                    onPress={({ geometry }) => {
                                        setPoint(geometry.coordinates)
                                        setLocation(geometry.coordinates)
                                        alert(`Localização selecionada!
                                    \n\n${geometry.coordinates}`)

                                    }}
                                    logoEnabled={false}
                                    compassEnabled={true}
                                    scaleBarEnabled={false}
                                    compassPosition={{ top: 80, right: 10 }}
                                    styleURL={mapOffline?.metadata._rnmapbox.styleURI}
                                    rotateEnabled={true}

                                    style={{ flex: 1 }}  >
                                    <Mapbox.Camera
                                        maxBounds={{
                                            ne: [mapOffline?.bounds[0], mapOffline?.bounds[1]],
                                            sw: [mapOffline?.bounds[2], mapOffline?.bounds[3]]
                                        }}
                                            minZoomLevel={12}
                                            maxZoomLevel={18}
                                            centerCoordinate={locationAtual}
                                            animationMode="none" />

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
                            }

                            {
                                !msg &&
                                !mapOffline &&
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
                                        animationMode="none" />

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
                            }
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
    containerBtnSelecionaMap: {
        width: '33.33%',
        padding: 4
    },
    btnSelecionarMap: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.gray
    },
    containerModal: {
        flex: 1,
        position: 'relative'
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    containerClose: {
        width: '100%',
        position: 'absolute'
    },
    close: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        margin: 5
    }

})