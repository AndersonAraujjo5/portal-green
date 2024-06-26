import { FlatList, Text, View, ScrollView } from "react-native";
import Clientes from "@/components/Cliente";
import CadastroBD from "@/database/CadastroBD";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { api } from "@/service/api";
export default function tabClientesScreen() {
    const [data, setData] = useState(); // dados que foram baixados da api
    const [dataPre, setDataPre] = useState() // dados não sincronizados

    useFocusEffect(useCallback(() => {
        // console.log("teste")
        NetInfo.fetch().then(async state => {
            try {
                if (state.isConnected) {
                    CadastroBD.enviarPreCadastros();

                    const { data } = await api.get('/v1/cliente');
                  
                    setData(data.data)

                    CadastroBD.addAll(data.data)
                    setDataPre(CadastroBD.getAllPreCadastros());
                    // console.log(CadastroBD.getAllPreCadastros())
                } else {
                    setData(CadastroBD.getAllCadastros())
                    setDataPre(CadastroBD.getAllPreCadastros());
                }
            } catch (error) {
                setData(CadastroBD.getAllCadastros())
            }
        })

    }, []))

    return (
        <View className="flex-1 mt-5">
            <ScrollView>
                {
                    dataPre &&
                    <View className="bg-yellow-200">
                        <Text className="text-2xl mt-5 ps-2">Não sincronizados</Text>
                        {
                            dataPre.map(item => (
                                <Clientes key={item.id} data={item} access={false}  />
                            ))
                        }
                    </View>
                }

                {
                    data &&
                    <View>
                        <Text className="text-2xl mt-5 ps-2">Sincronizado</Text>
                        {
                            data.map(item => (
                                <Clientes key={item.id} data={item} />
                            ))
                        }
                    </View>
                }
            </ScrollView>
            {/* <FlatList
                data={data}
                renderItem={({ item }) => {
                    return (
                        <Clientes data={item} />
                    )
                }}
                keyExtractor={item => item.id.toString()}
            /> */}
        </View>
    )
}