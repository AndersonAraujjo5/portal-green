import { FlatList, Text, View } from "react-native";
import Clientes from "@/components/Cliente";
import CadastroBD from "@/database/CadastroBD";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { api } from "@/service/api";
export default function tabClientesScreen() {
    const [data, setData] = useState([]);

    useFocusEffect(useCallback(() => {
        NetInfo.fetch().then(async state => {
            if (state.isConnected) {
               const {data} = await api.get('/v1/cliente');
               console.log(data.data)
               setData(data.data)
               CadastroBD.addAll(data.data)
            } else {
             setData(CadastroBD.getAllCadastros())
            }
          })

    },[])) 

    return (
        <View className="flex-1 mt-5">
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return (
                        <Clientes data={item} />
                    )
                }}
                keyExtractor={item => item.id}
            />

        </View>
    )
}