import { useEffect, useRef, useState } from "react";
import * as Location from 'expo-location';
import { Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import CadastroBD from "@/database/CadastroBD";
import ModalDetalhesCliente from "./ModalDetalhesCliente";
import { useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from "expo-router";

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

export default function MakerPoint() {
    const [location, setLocation] = useState<number[] | [number, number]>();
    const [onModal, setOnModal] = useState()
    const [typeMap, setTypeMap] = useState<String | StyleURL>(StyleURL.Street);
    const [clientesData, setClientesData] = useState<any>([])
    const [mapOffline, setMapOffline] = useState();
    const { type, isConnected } = useNetInfo();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
        })();

        if (CadastroBD.findByExistCordenadas()) {
            setClientesData(CadastroBD.findByExistCordenadas())
        }
    }, []);

    const getLocalizacao = async () => {
        let getLocation = await Location.getCurrentPositionAsync({});
        setLocation([getLocation.coords.longitude, getLocation.coords.latitude])
    }

    const activeMapOffilne = async () => {
        const offlinePack = await Mapbox.offlineManager.getPack("mapOffline")
        setMapOffline(offlinePack)
    }

    useFocusEffect(() => {
        getLocalizacao();

        if (!isConnected) {
            activeMapOffilne()
        } else {
            setMapOffline(null)
        }
    })



    const handleTypeMap = (styleUrl: string) => {
        setTypeMap(styleUrl)
    }

    if (!location) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Carregando</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 pt-14">
            
            <View className="flex-1 justify-center content-center relative">
                <View className="w-full h-full">
                    {
                        mapOffline ?
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
                                    clientesData && clientesData.map((item) => (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={item.id.toString()}
                                            id={item.id.toString()}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                        />
                                    ))
                                }
                            </Mapbox.MapView>
                            :
                            <Mapbox.MapView
                                logoEnabled={false}
                                compassEnabled={true}
                                scaleBarEnabled={false}
                                compassPosition={{ top: 80, right: 10 }}
                                styleURL={typeMap}
                                rotateEnabled={true}
                                onPress={() => setOnModal(null)}
                                style={{ flex: 1 }} >
                                <Mapbox.Camera zoomLevel={12} centerCoordinate={location} animationMode="none" />
                                <Mapbox.UserLocation
                                    animated={true}
                                    visible={true} />
                                {
                                    clientesData && clientesData.map((item) => (
                                        <Mapbox.PointAnnotation
                                            title={item.cliente}
                                            snippet={item.cliente}
                                            selected={true}
                                            key={item.id.toString()}
                                            id={item.id.toString()}
                                            onSelected={() => {
                                                setOnModal(ModalDetalhesCliente(item))
                                            }}
                                            coordinate={item.cordenadas.split(',')}
                                        />
                                    ))
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