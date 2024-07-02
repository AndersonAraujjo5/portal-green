import { FlatList, Text, View, ScrollView, RefreshControl } from "react-native";
import Clientes from "@/components/Cliente";
import CadastroBD from "@/database/CadastroBD";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { api } from "@/service/api";
import Loader from "@/components/Loader";
export default function tabClientesScreen() {
    const [data, setData] = useState(); // dados que foram baixados da api
    const [dataPre, setDataPre] = useState() // dados não sincronizados
    const [msgError, setMsgErro] = useState();
    useFocusEffect(useCallback(() => {

        NetInfo.fetch().then(state => {
            try {
                if (state.isConnected) {
                    CadastroBD.synchronize()

                    api.get('/v1/cliente').then(({ data }) => {
                        setData(data.data)
                        CadastroBD.addAll(data.data)
                    }).catch(err => {
                        if (err.errors) {
                            setMsgErro(err.errors)
                            setData(CadastroBD.getAllCadastros())
                        }
                        return err;
                    })

                    setDataPre(CadastroBD.getAllPreCadastros());
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
        <View className="flex-1 mt-14">
            {
                (!data && !dataPre && !msgError) && <Loader show={true} />
            }
            {
                msgError &&
                <ScrollView className="flex-1 px-4">
                    {
                        msgError.map((e,i) => <Text key={i} className="text-2xl text-center">{e}</Text>)
                    }
                </ScrollView>
            }
            <ScrollView>
                {
                    dataPre &&
                    <View className="bg-yellow-200">
                        <Text className="text-2xl mt-5 ps-2">Não sincronizados</Text>
                        {
                            dataPre.map(item => (
                                <Clientes key={item.id} data={item} access={false} />
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
        </View>
    )
}