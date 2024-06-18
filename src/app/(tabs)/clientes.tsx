import { FlatList, Text, View } from "react-native";
import Clientes from "@/components/Cliente";
import CadastroBD from "@/database/CadastroBD";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
export default function tabClientesScreen() {
    const [data, setData] = useState([]);

    useFocusEffect(useCallback(() => {
        setData(CadastroBD.getAllCadastros())
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