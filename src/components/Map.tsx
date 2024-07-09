import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import ModalDetalhesCliente from "./ModalDetalhesCliente";
import { useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import Loader from "./Loader";
import PreCadastro from "@/database/PreCadastro";
import Cliente from "@/database/Cliente";
import axios from "axios";

export enum ClienteStatus {
    CadastroPendente = "Cadastro Pendente",
    CadastroEnviado = "Cadastro Enviado",
    UsuarioCriado = "Usuário Criado",
    TecnicoDesignado = "Técnico Designado",
    TecnicoACaminho = "Técnico a Caminho",
    InstalacaoEmAndamento = "Instalação em Andamento",
    InstalacaoConcluida = "Instalação Concluída",
    ClienteDesistiu = "Cliente Desistiu"
}

function LocationPin({ status }) {
    return (
        <>
            {
                status === ClienteStatus.UsuarioCriado &&
                <Entypo name="location-pin" size={40} color={'red'} />
            }
            {
                (status === ClienteStatus.InstalacaoEmAndamento ||
                    status === ClienteStatus.TecnicoACaminho ||
                    status === ClienteStatus.TecnicoDesignado
                ) &&
                <Entypo name="location-pin" size={40} color={'orange'} />
            }
            {
                (status === ClienteStatus.InstalacaoConcluida) &&
                <Entypo name="location-pin" size={40} color={'blue'} />
            }
            {
                (status === ClienteStatus.ClienteDesistiu) &&
                <Entypo name="location-pin" size={40} color={'black'} />
            }
        </>
    )
}

export default function MakerPoint() {
    const [location, setLocation] = useState<number[] | [number, number]>();
    const [onModal, setOnModal] = useState()
    const [typeMap, setTypeMap] = useState<String | StyleURL>(StyleURL.Street);
    const [clientesData, setClientesData] = useState<any>([])
    const [mapOffline, setMapOffline] = useState();
    const { isConnected } = useNetInfo();
    const [update, setUpdate] = useState(0)
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        })();

    }, []);

    useEffect(() => {
        if (update) {
            setOnModal(null)
            sincronizar();
        }
    }, [update])

    const sincronizar = () => {
        PreCadastro.asyncEnviar();
        if (Cliente.findAll()) {
            setClientesData(Cliente.findAll())
        }
    }

    const getLocalizacao = async () => {
        let getLocation = await Location.getCurrentPositionAsync({});
        setLocation([getLocation.coords.longitude, getLocation.coords.latitude])
    }

    const activeMapOffilne = async () => {
        const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
        
        if (offlinePack) {
            setMapOffline(offlinePack)
            getLocalizacao();
            setMsg(null)
            return
        };
        getLocalizacao();
        setMsg(`Você não tem mapa baixado, para utilizar offline!\nClick no seu perfil e depois em baixar mapa, escolha  area que deseja e aperte no botão baixar`)
    }

    useFocusEffect(useCallback(() => {
        setMsg(null)
        setOnModal(null)
        sincronizar();

        if (!isConnected) {
            activeMapOffilne();
            console.log('is')
        } else {
            axios.get('https://google.com', { timeout: 5000 }).then(e => {
              getLocalizacao();
              console.log("com")
            }).catch(e => {
              console.log("sem")

                activeMapOffilne();
            })
        }
    }, [isConnected]))


    const handleTypeMap = (styleUrl: string) => {
        setTypeMap(styleUrl)
    }

    if (!location) {
        return (
            <Loader show={true} />
        )
    }

    if (msg) {
        return (
            <View style={{ flex: 1, justifyContent: "center", padding: 12 }}>
                <Text style={{
                    fontSize: 20,
                    lineHeight: 28,
                }}>{msg}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>

            <View style={styles.box}>
                <View style={{ width: '100%', height: '100%' }}>
                    {
                        mapOffline &&
                        <Mapbox.MapView
                            logoEnabled={false}
                            compassEnabled={true}
                            scaleBarEnabled={false}
                            compassPosition={{ top: 80, right: 10 }}
                            styleURL={mapOffline?.metadata._rnmapbox.styleURI}
                            rotateEnabled={true}
                            onPress={() => setOnModal(null)}
                            style={{ flex: 1 }} >

                            <Mapbox.Camera maxBounds={{
                                ne: [mapOffline?.bounds[0], mapOffline?.bounds[1]],
                                sw: [mapOffline?.bounds[2], mapOffline?.bounds[3]]
                            }}
                                minZoomLevel={12}
                                maxZoomLevel={18}
                                centerCoordinate={location}
                                animationMode="none" />
                            <Mapbox.UserLocation
                                animated={true}
                                visible={true} />
                            {
                                clientesData && clientesData.map((item) => {
                                    if (item.status === ClienteStatus.CadastroEnviado ||
                                        item.status === ClienteStatus.CadastroPendente
                                    ) return;

                                    return (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={item.id.toString()}
                                            id={item.id.toString()}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item, setUpdate))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                        >
                                            <LocationPin status={item.status} />
                                        </Mapbox.PointAnnotation>
                                    )
                                })
                            }
                        </Mapbox.MapView>
                    }
                    {!mapOffline &&
                        <Mapbox.MapView
                            logoEnabled={false}
                            compassEnabled={true}
                            scaleBarEnabled={false}
                            compassPosition={{ top: 80, right: 10 }}
                            styleURL={typeMap}
                            rotateEnabled={true}
                            onPress={() => setOnModal(null)}
                            style={{ flex: 1 }} >
                            <Mapbox.Camera zoomLevel={12}
                                centerCoordinate={location}
                                animationMode="none" />
                            <Mapbox.UserLocation
                                animated={true}
                                visible={true} />
                            {
                                clientesData && clientesData.map((item) => {
                                    if (item.status === ClienteStatus.CadastroEnviado ||
                                        item.status === ClienteStatus.CadastroPendente
                                    ) return;

                                    return (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={item.id.toString()}
                                            id={item.id.toString()}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item, setUpdate))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                            style={{
                                                backgroundColor: 'blue',

                                            }}
                                        >
                                            <LocationPin status={item.status} />
                                        </Mapbox.PointAnnotation>
                                    )
                                })
                            }
                        </Mapbox.MapView>
                    }
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
    container: {
        flex: 1,
        paddingTop: 25,
    },
    box: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
    }
})