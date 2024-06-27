import ButtonAction from "@/components/ButtonActions";
import { Dimensions, FlatList, Pressable, View, ScrollView, Text, Image } from "react-native";
import Images from "@/utils/Images";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import CacherImage from "./CacherImage";

export default function ModalDetalhesCliente({ cliente, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
    cep, email, telefone, cordenadas, status, plano, vencimento, Fotos, Comentarios, associado
}: any) {


    const { width } = Dimensions.get('window');
    const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento"];
    const obj: any = { pppoe, telefone, email, plano, fidelidade, vencimento };

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
                <ScrollView className="px-2 my-5"
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {
                    Fotos.map((item,index) => (
                       <CacherImage url={item.url} width={width} key={index}/>
                    ))
                }
                </ScrollView>

                {
                    Comentarios.map((item: any) => (
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