import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

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
    const [point, setPoint] = useState<number[] | [number, number]>()
    const [onModal, setOnModal] = useState()

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
    }, []);

    if (!location) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Carregando</Text>
            </View>
        )
    }

    const fetchRoute = async (origin, destination) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination[1]},${destination[0]}`;
        console.log(url)
        //     try {
        //       const response = await fetch(url);
        //       const data = await response.json();
        //       if (data.routes && data.routes.length > 0) {
        //         setRoute(data.routes[0].geometry);
        //       }
        //     } catch (error) {
        //       console.error(error);
        //     }
    };

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

    const modalInfo: any = ({ nome, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
        cep, email, telefone, cordenadas, status
    }: infoCliente) => {
        return (
            <View className="w-full h-96 rounded-t-lg bg-white bottom-48 py-5">
                <ScrollView className="px-2"
                    showsVerticalScrollIndicator={false}>
                    <Text className="text-xl my-2 font-bold">{nome}</Text>
                    <Text>PPPOE: {pppoe}</Text>
                    <Text>{email}</Text>
                    <Text>{telefone}</Text>
                    <Text>{endereco}, {casa} – {bairro} - {cidade} - {cep}</Text>
                    <Text>Plano de {velocidade} megas</Text>
                    <Text>{fidelidade}</Text>
                    <Text>Mais info: {info}</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="my-5 ">
                        <View className="flex-row">
                            <Link className="bg-blue-400 px-4 py-3 rounded-full flex-row items-center gap-2"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${cordenadas[0]},${cordenadas[1]}`}>
                                <FontAwesome name="location-arrow" size={20} color="black" />
                                <Text>Rotas</Text>
                            </Link>
                            {
                                status == ClienteStatus.UsuarioCriado &&
                                <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                                    <Text>iniciar atendimento</Text>
                                </Pressable>
                            }
                            {
                                status == ClienteStatus.TecnicoACaminho &&
                                <>
                                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                                        <Text>Finalizar</Text>
                                    </Pressable>
                                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                                        <Text>Pausar</Text>
                                    </Pressable>
                                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                                        <Text>Cancelar instalação</Text>
                                    </Pressable>
                                </>
                            }
                            <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                                <Text>Comentar</Text>
                            </Pressable>

                        </View>
                    </ScrollView>
                    <FlatList
                        className="px-2 my-5"
                        horizontal={true}
                        data={imagesItem}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onLongPress={() => alert("isso")}>
                                    <Image
                                        className=" my-2 rounded-lg mx-2"
                                        width={width / 2} height={200}
                                        source={{ uri: item.img }}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                            )
                        }}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <View className="border-b-2 my-2">
                        <View className="flex-row items-center gap-3">
                            <AntDesign className="rounded-full bg-slate-200" name="user" size={25} />
                            <View className="">
                                <Text>Usuário</Text>
                                <Text>90/03/2024</Text>
                            </View>
                        </View>
                        <Text className="my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor amet expedita tempore molestias. Labore corporis numquam blanditiis illo sequi repellendus quidem saepe, culpa a laboriosam dolores cum. Autem, quidem distinctio?</Text>
                    </View>
                    <View className="border-b-2 my-2">
                        <View className="flex-row items-center gap-3">
                            <AntDesign className="rounded-full" name="user" size={25} />
                            <View className="">
                                <Text>Usuário</Text>
                                <Text>90/03/2024</Text>
                            </View>
                        </View>
                        <Text className="my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor amet expedita tempore molestias. Labore corporis numquam blanditiis illo sequi repellendus quidem saepe, culpa a laboriosam dolores cum. Autem, quidem distinctio?</Text>
                    </View>

                </ScrollView>
            </View>
        )
    }

    return (
        <View className="flex-1 pt-14">
            <View className="flex-1 justify-center content-center relative">
                <View className="w-full h-full">
                    <Mapbox.MapView
                        rotateEnabled={true}
                        onPress={({ geometry }) => {
                            setPoint(geometry.coordinates)
                            setOnModal(null)
                        }}
                        style={{ flex: 1 }} >
                        <Mapbox.Camera zoomLevel={15} centerCoordinate={location} />
                        <Mapbox.UserLocation
                            animated={true}
                            visible={true} />
                        <Mapbox.PointAnnotation
                            title="Teste"
                            snippet="Teste"
                            selected={true}
                            key="pointAnnotation"
                            id="pointAnnotation"
                            onSelected={() => {
                                const data = {
                                    nome: "Anderson tailon",
                                    bairro: "caixa d'agua",
                                    casa: "sem numero",
                                    cep: "687000000",
                                    cidade: "Capanema",
                                    email: "andersonaraujjo5@gmail.com",
                                    endereco: "rua sergio bruto ucuuba",
                                    fidelidade: "Com fidelidade",
                                    localizacao: "ooo",
                                    pppoe: "anderson@gmail.com",
                                    telefone: "91996031077",
                                    velocidade: 200,
                                    cordenadas: '-1.184255, -47.149697'.split(','),
                                    status: 'Usuário Criado'
                                }
                                setOnModal(modalInfo(data))
                            }}
                            coordinate={[-47.149697, -1.184255]}
                        />

                    </Mapbox.MapView>
                </View>
                {
                    onModal && <>{onModal}</>
                }
            </View>
        </View>

    )
}