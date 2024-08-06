import { useCallback, useEffect, useState } from "react";
import * as Location from 'expo-location';
import { StyleSheet, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import ModalDetalhesCliente from "./ModalDetalhesCliente";
import { useFocusEffect } from "expo-router";
import Loader from "./Loader";
import Cliente from "@/database/Cliente";
import SafeStatusBar from "./SafeStatusBar";
import InfoMap from "@/components/InfoMap";
import { Entypo } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import axios from "axios";

export enum ClienteStatus {
    SincronizacaoPendente = "Sincronização Pendente",
    CadastroPendente = "Cadastro Pendente",
    CadastroEnviado = "Cadastro Enviado",
    UsuarioCriado = "Usuário Criado",
    TecnicoDesignado = "Técnico Designado",
    TecnicoACaminho = "Técnico a Caminho",
    InstalacaoEmAndamento = "Instalação em Andamento",
    InstalacaoConcluida = "Instalação Concluída",
    ClienteDesistiu = "Cliente Desistiu",
    Cancelado = "Cancelado",
    CarneEntregue = "Carnê Entregue"
}


export const statusColor = (status:string, fatura='') => {
    if(ClienteStatus.UsuarioCriado === status) return 'red'
    else if(status === ClienteStatus.InstalacaoEmAndamento ||
        status === ClienteStatus.TecnicoACaminho ||
        status === ClienteStatus.TecnicoDesignado) return 'orange'
    else if(ClienteStatus.InstalacaoConcluida === status && fatura === 'Carnê') return Colors.green
    else if(ClienteStatus.InstalacaoConcluida === status) return 'blue'
    else if(ClienteStatus.CadastroPendente === status) return 'gray'
    else if(ClienteStatus.ClienteDesistiu === status || ClienteStatus.Cancelado) return 'black'
}

export function LocationPin({ status, fatura, size = 40, ...rest }) {
    return (
        <>
            {
                status === ClienteStatus.UsuarioCriado &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.InstalacaoEmAndamento ||
                    status === ClienteStatus.TecnicoACaminho ||
                    status === ClienteStatus.TecnicoDesignado
                ) &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.InstalacaoConcluida) &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.ClienteDesistiu) &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.Cancelado) &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.InstalacaoConcluida && fatura === "Carnê") &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
            {
                (status === ClienteStatus.CarneEntregue) &&
                <Entypo name="location-pin" size={size} color={statusColor(status, fatura)} {...rest} />
            }
        </>
    )
}

export function Map({ param }: any) {
    const [location, setLocation] = useState<number[] | [number, number]>();
    const [onModal, setOnModal] = useState()
    const [typeMap, setTypeMap] = useState<String | StyleURL>(StyleURL.Street);
    const [clientesData, setClientesData] = useState<any>([])
    const [mapOffline, setMapOffline] = useState(null);
    const [update, setUpdate] = useState(0)

    const requestForegroundPermissionsAsync = async ()=> {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert("Para ter acesso ao mapa, você precisa permitir o acesso a sua localização!")
            requestForegroundPermissionsAsync()
            return;
        }
    }

    useEffect(() => {
        requestForegroundPermissionsAsync();

    }, []);

    useEffect(() => {
        if (update) {
            setOnModal(null)
            sincronizar();
        }
    }, [update])


    const sincronizar = () => {
        if (param && param === 'carnê') return setClientesData(Cliente.findBy((item) => {
            if (item.status === ClienteStatus.InstalacaoConcluida && item.fatura === "Carnê") return item;
        }))
        else if (param == "all" && Cliente.findAll()) {
            return setClientesData(Cliente.findAll())
        }
        else if (param) return setClientesData(Cliente.findBy((item) => {
            if (item.status === param) return item;
        }))

    }

    const getLocalizacao = async () => {
        try {
            let getLocation = await Location.getCurrentPositionAsync({});
            setLocation([getLocation.coords.longitude, getLocation.coords.latitude])
        } catch (error) {
            getLocalizacao();
        }
    }

    const activeMapOffilne = async () => {
        try {
            await axios.get('https://google.com', {
                timeout: 2000
            })

            setMapOffline(null)
        } catch (error) {

            Mapbox.offlineManager.getPack("mapOffline").then(offlinePack => {
                if (offlinePack) setMapOffline(offlinePack)
            }).catch(e => e)
        }
        getLocalizacao()
    }


    const handleTypeMap = (styleUrl: string) => {
        setTypeMap(styleUrl)
    }



    useFocusEffect(useCallback(() => {
        setOnModal(null)
        sincronizar();
        activeMapOffilne();
    }, [param]))

    if (!location) {
        return (
            <Loader show={true} />
        )
    }

    return (
        <SafeStatusBar >
            <InfoMap />
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

                            <Mapbox.Camera bounds={{
                                ne: [mapOffline?.bounds[0], mapOffline?.bounds[1]],
                                sw: [mapOffline?.bounds[2], mapOffline?.bounds[3]]
                            }}


                                animationMode="none" />
                            <Mapbox.UserLocation
                                animated={true}
                                visible={true} />
                            {
                                clientesData.length !== 0 && clientesData.map((item, index) => {
                                    if (item.status === ClienteStatus.CadastroEnviado ||
                                        item.status === ClienteStatus.CadastroPendente
                                    ) return;

                                    return (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={`${item.id}-${index}-cliente`}
                                            id={`${item.id}-${index}-id`}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item, setUpdate))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                        >
                                            <LocationPin fatura={item.fatura} status={item.status} />
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
                                clientesData.length !== 0 && clientesData.map((item, index) => {
                                    if (item.status === ClienteStatus.CadastroEnviado ||
                                        item.status === ClienteStatus.CadastroPendente
                                    ) return;

                                    return (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={`${item.id}-${index}-cliente`}
                                            id={`${item.id}-${index}-cliente`}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item, setUpdate))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                            style={{
                                                backgroundColor: 'blue',

                                            }}
                                        >
                                            <LocationPin fatura={item.fatura} status={item.status} />
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
                {
                    !mapOffline && <CamadaMap setType={handleTypeMap} />
                }
            </View>
        </SafeStatusBar>

    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
    }
})