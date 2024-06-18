import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import Mapbox from "@/components/MapBox";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import CamadaMap, { StyleURL } from "@/components/CamadaMap";
import MapaBD from "@/database/MapaBD";
import CadastroBD, { FormData } from '@/database/CadastroBD';
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
        if(getTypeMap){
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
        cep, email, telefone, cordenadas, status, plano,vencimento, foto
    }: infoCliente) =>
      {
        const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento"];
        const obj = {pppoe, telefone, email, plano, fidelidade, vencimento};
        return (
            <View className="w-full h-96 rounded-t-lg bg-white bottom-48 py-5">
                <ScrollView className="px-2"
                    showsVerticalScrollIndicator={false}>
                    <Text className="text-xl my-2 font-bold">{nome}</Text>
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
                        styleURL={typeMap}
                        rotateEnabled={true}
                        onPress={({ geometry }) => {
                            setOnModal(null)
                        }}
                        style={{ flex: 1 }} >
                        <Mapbox.Camera zoomLevel={15} centerCoordinate={clienteData.cordenadas.reverse()} />
                        <Mapbox.UserLocation
                            visible={true} />
                        <Mapbox.PointAnnotation
                            selected={true}
                            key="pointAnnotation"
                            id="pointAnnotation"
                            onSelected={() => {
                                setOnModal(modalInfo(clienteData))
                            }}
                            coordinate={clienteData.cordenadas}
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