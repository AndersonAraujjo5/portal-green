import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import MapaBD from "@/database/MapaBD";
import NetInfo from "@react-native-community/netinfo";
import CadastroBD from "@/database/CadastroBD";
import ModalDetalhesCliente from "./ModalDetalhesCliente";

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
        const getTypeMap = MapaBD.find().type
        if (getTypeMap) {
            setTypeMap(getTypeMap)
        }

        if (CadastroBD.findByExistCordenadas()) {
            setClientesData(CadastroBD.findByExistCordenadas())
        }

    }, []);


    // NetInfo.fetch().then(state => {
    //     if (state.isConnected) {
    //         // envia os dados para a api
    //         // caso de algum erro ao enviar os dados, tratar para salvar
    //         // as informações local
    //         setClientesData(CadastroBD.getAllCadastros());
    //     } else {
    //         //setClientesData(CadastroBD.getAllCadastros());
    //         // Caso não tenha internet, salvar altomaticamente 
    //         // no dispositivo

    //     }
    // })

    const handleTypeMap = (styleUrl: string) => {
        MapaBD.add(styleUrl);
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
                    <Mapbox.MapView
                        styleURL={typeMap}
                        rotateEnabled={true}
                        onPress={() => setOnModal(null)}
                        style={{ flex: 1 }} >
                        <Mapbox.Camera zoomLevel={15} centerCoordinate={location} animationMode="none" />
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
                </View>
                {
                    onModal && <>{onModal}</>
                }
                <CamadaMap setType={handleTypeMap} />
            </View>
        </View>

    )
}