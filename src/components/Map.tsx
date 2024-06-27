import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import MapaBD from "@/database/MapaBD";
import NetInfo from "@react-native-community/netinfo";
import CadastroBD from "@/database/CadastroBD";
import ButtonAction from "./ButtonActions";

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

type infoCliente = {
    nome: string
    pppoe?: string
    email?: string
    telefone?: string
    cep?: string
    cidade: string
    endereco: string
    bairro: string
    casa: string
    ref?: string
    velocidade: string
    fidelidade?: string
    cordenadas: string
    info?: string
}

export default function MakerPoint() {
    const { width } = Dimensions.get('window');
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

    const imagesItem = [
        {
            id: 1,
            img: 'https://cdn.pixabay.com/photo/2019/06/09/21/54/santorini-4263036_1280.jpg'
        },
        {
            id: 2,
            img: 'https://cdn.pixabay.com/photo/2012/12/27/19/41/floating-tire-72963_640.jpg'
        }
    ]

    const modalInfo: any = ({ cliente, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
        cep, email, telefone, cordenadas, status, associado, plano, vencimento, Comentarios, Fotos
    }: infoCliente) => {
        const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento"];
        const obj = { pppoe, telefone, email, plano, fidelidade, vencimento, };
        return (
            <View className="w-full h-96 rounded-t-lg bg-white bottom-48 py-5">
                <ScrollView className="px-2"
                    showsVerticalScrollIndicator={false}>
                    <Text className="text-xl my-2 font-bold">{cliente}</Text>
                    <Text>Status: {status}</Text>
                    <Text>Vendedor: {associado}</Text>
                    <Text>{endereco}, {casa} – {bairro} - {cidade} - {cep}</Text>
                    {
                        vars.map((item, index) => (
                            obj[item] && <Text key={`${item}-${index}`}>{[item].toString().toLowerCase()}: {obj[item]}</Text>
                        ))
                    }
                    <Text>Mais info: {info}</Text>
                    <ButtonAction cordenadas={cordenadas} status='Usuário Criado' />
                    <FlatList
                        className="px-2 my-5"
                        horizontal={true}
                        data={Fotos}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onLongPress={() => alert("isso")}>
                                    <Image
                                        className=" my-2 rounded-lg mx-2"
                                        width={width / 2} height={200}
                                        source={{ uri: item.url }}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                            )
                        }}
                        keyExtractor={(item) => item.fileName}
                    />
                    {
                        Comentarios.map(item => (
                            <View className="border-b-2 my-2" key={`${item.id}-comentario`}>
                                <View className="flex-row items-center gap-3">
                                    <AntDesign className="rounded-full bg-slate-200" name="user" size={25} />
                                    <View className="">
                                        <Text>{item.associado}</Text>
                                        <Text>{item.createAt}</Text>
                                    </View>
                                </View>
                                {
                                    (item.type == 'image' || item.type == 'file') &&
                                    <Image
                                        className=" my-2 rounded-lg mx-2"
                                        width={width / 2} height={200}
                                        source={{ uri: item.url }}
                                        resizeMode="cover"
                                    />
                                }
                                <Text className="my-2">{item.body}</Text>
                            </View>
                        ))
                    }

                </ScrollView>
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
                                        setOnModal(modalInfo(item))
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