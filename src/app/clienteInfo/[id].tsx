import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from "react";
import * as Location from 'expo-location';
import { StyleSheet, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import ModalDetalhesCliente from '@/components/ModalDetalhesCliente';
import Cliente from '@/database/Cliente';
import { useNetInfo } from '@react-native-community/netinfo';
import axios from 'axios';
import Loader from '@/components/Loader';
import OfflinePack from '@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack';
import { LocationPin } from '@/components/Map';

export default function page() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [update, setUpdate] = useState(0)
    const [onModal, setOnModal] = useState<void>()
    const [typeMap, setTypeMap] = useState<string>(StyleURL.Street);
    const [mapOffline, setMapOffline] = useState<OfflinePack | undefined>();
    const [stateConnect, setStateConnect] = useState(false)
    const [clienteData, setClientesData] = useState(Cliente.findById(Number(id)));
    const { isConnected } = useNetInfo();

    const navigation = useNavigation();
 
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

        })();

        navigation.setOptions({
            title: ""
        })

    }, []);

    useEffect(() => {
        if(Cliente.findById(Number(id))) {
            setClientesData(Cliente.findById(Number(id)))
        }
    },[update])

    const activeMapOffline = async () => {
        const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
        if (offlinePack) {
            setMapOffline(offlinePack)
            setStateConnect(true);
            return
        };
        setStateConnect(true);
    }

    const checkIsOffline = () => {
        if (!isConnected) {
            activeMapOffline();
        } else {
            axios.get('https://google.com', { timeout: 2000 }).then(e => {
                setStateConnect(true);
            }).catch(e => {
                activeMapOffline();
            })
        }
    }

    useFocusEffect(useCallback(() => {
        checkIsOffline();
        setOnModal(ModalDetalhesCliente(clienteData, setUpdate))
    }, [isConnected, update]))


    const handleTypeMap = (styleUrl: string) => {
        setTypeMap(styleUrl)
    }

    if (!stateConnect) {
        return <Loader show={true} />
    }

    if (!clienteData) {
        router.replace('/tabs/clientes')
        return <></>
    }
    
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.box}>
                    {
                        mapOffline &&
                        <>
                            <Mapbox.MapView
                                styleURL={mapOffline?.metadata._rnmapbox.styleURI}
                                rotateEnabled={true}
                                logoEnabled={false}
                                compassEnabled={true}
                                scaleBarEnabled={false}
                                compassPosition={{ top: 80, right: 10 }}
                                onPress={({ geometry }) => {
                                    setOnModal(null)
                                }}

                                style={{ flex: 1 }} >
                                <Mapbox.Camera
                                    bounds={{
                                        ne: [Number(mapOffline?.bounds[0]), Number(mapOffline?.bounds[1])],
                                        sw: [Number(mapOffline?.bounds[2]), Number(mapOffline?.bounds[3])]
                                    }}
                                    centerCoordinate={clienteData.cordenadas.split(',')}
                                    animationMode="none" />
                                <Mapbox.UserLocation
                                    animated={true}
                                    visible={true} />
                                <Mapbox.PointAnnotation
                                    selected={true}
                                    key="pointAnnotation"
                                    id="pointAnnotation"
                                    onSelected={() => {
                                        setOnModal(ModalDetalhesCliente(clienteData, setUpdate))
                                    }}
                                    coordinate={clienteData.cordenadas.split(',')}
                                />

                            </Mapbox.MapView></>
                    }
                    {
                        !mapOffline &&
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
                                    setOnModal(ModalDetalhesCliente(clienteData,setUpdate))
                                }}
                                coordinate={clienteData.cordenadas.split(',')}
                            >
                                <LocationPin fatura={clienteData.fatura} status={clienteData.status} />
                            </Mapbox.PointAnnotation>

                        </Mapbox.MapView>
                    }
                </View>
                {
                    onModal && <>{onModal}</>
                }
                
               {
                !mapOffline &&
                <CamadaMap setType={handleTypeMap} />
               }
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
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
