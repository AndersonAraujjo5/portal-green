import { FlatList, Text, View, ScrollView, RefreshControl } from "react-native";
import Clientes from "@/components/Cliente";
import CadastroBD from "@/database/CadastroBD";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import { api } from "@/service/api";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
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
        <View style={styles.container}>
            {
                (!data && !dataPre && !msgError) && <Loader show={true} />
            }
            {
                msgError &&
                <ScrollView style={{flex: 1, paddingBottom:8, paddingTop:8}}>
                    {
                        msgError.map((e,i) => <Text key={i}
                        style={{fontSize:24, lineHeight: 32, textAlign: 'center'}}>{e}</Text>)
                    }
                </ScrollView>
            }
            <ScrollView>
                {
                    dataPre &&
                    <View style={{backgroundColor: '#fef08a'}}>
                        <Text style={styles.title}>Não sincronizados</Text>
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
                        <Text style={styles.title}>Sincronizado</Text>
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

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 14
    },
    title: {
        fontSize:24, 
        lineHeight: 32, 
        marginTop:20, 
        paddingRight: 8 
    }
})