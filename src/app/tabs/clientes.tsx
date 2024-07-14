import { Text, View, ScrollView, RefreshControl } from "react-native";
import Clientes from "@/components/Cliente";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
import Cliente from "@/database/Cliente";
import Comentario from "@/database/Comentario";
import SafeStatusBar from "@/components/SafeStatusBar";
import PreCadastro from "@/database/PreCadastro";
import Status from "@/database/Status";
export default function tabClientesScreen() {
    const [data, setData] = useState<object>(); // dados que foram baixados da api
    const [msgError, setMsgErro] = useState();
    const [refreshing, setRefreshing] = useState(false);

    const syncronize = () => {
        PreCadastro.asyncEnviar();
        Comentario.asyncEnviar()
        Status.asyncEnviar();
        
        Cliente.syncronize()
            .then(item => {
                if (item.length != 0){
                    setData(item)
                    setMsgErro(null)
                }
                else {
                    setMsgErro(['Sem usuarios cadastrados'])
                    setData(null)
                }
            }).catch(e => {
                setData(Cliente.findAll());
            });
    }

    useFocusEffect(useCallback(() => {
       syncronize();
    }, []))

    const onRefresh = () => {
        setRefreshing(true)
       syncronize();
        setRefreshing(false)
    }


    return (
        <SafeStatusBar >
            {
                (!data && !msgError) && <Loader show={true} />
            }
            {
                msgError &&
                <ScrollView style={{ flex: 1, paddingBottom: 8, paddingTop: 8 }}>
                    {
                        msgError.map((e, i) => <Text key={i}
                            style={{
                                fontSize: 24, lineHeight: 32, textAlign: 'center',
                                marginTop: 50
                            }}>{e}</Text>)
                    }
                </ScrollView>
            }
            {
                data &&
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing}
                        onRefresh={onRefresh} />}>

                    <View>
                        {
                            data.map((item, index) => (
                                <Clientes key={`clientes-${index}`} data={item} />
                            ))
                        }
                    </View>

                </ScrollView>
            }
        </SafeStatusBar>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        lineHeight: 32,
        padding: 8
    }
})