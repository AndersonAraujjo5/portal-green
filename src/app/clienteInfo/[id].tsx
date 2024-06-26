import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import { AntDesign } from "@expo/vector-icons";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import MapaBD from "@/database/MapaBD";
import CadastroBD from '@/database/CadastroBD';
import ButtonAction from '@/components/ButtonActions';

export default function page() {
    const { width } = Dimensions.get('window');
    const [location, setLocation] = useState<number[] | [number, number]>();
    const [onModal, setOnModal] = useState()
    const [typeMap, setTypeMap] = useState<String | StyleURL>(StyleURL.Street);

    const { id } = useLocalSearchParams<{ id?: string }>();

    const clienteData = CadastroBD.getFindById(id);

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
    }, []);


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

    const modalInfo: any = ({ cliente, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
        cep, email, telefone, cordenadas, status, plano, vencimento, foto, Comentarios, associado
    }: infoCliente) => {
        const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento"];
        const obj = { pppoe, telefone, email, plano, fidelidade, vencimento };
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
                        data={foto}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onLongPress={() => alert("isso")}>
                                    <Image
                                        className=" my-2 rounded-lg mx-2"
                                        width={width / 2} height={200}
                                        source={{ uri: item.uri }}
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
        <View className="flex-1">
            <View className="flex-1 justify-center content-center relative">
                <View className="w-full h-full">
                    <Mapbox.MapView
                        styleURL={typeMap}
                        rotateEnabled={true}
                        onPress={({ geometry }) => {
                            setOnModal(null)
                        }}
                        style={{ flex: 1 }} >
                        <Mapbox.Camera zoomLevel={15} centerCoordinate={clienteData.cordenadas.split(',')} />
                        <Mapbox.UserLocation
                            visible={true} />
                        <Mapbox.PointAnnotation
                            selected={true}
                            key="pointAnnotation"
                            id="pointAnnotation"
                            onSelected={() => {
                                setOnModal(modalInfo(clienteData))
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