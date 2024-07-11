import { Text, View, ScrollView, RefreshControl } from "react-native";
import Clientes from "@/components/Cliente";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
import Cliente from "@/database/Cliente";
import Comentario from "@/database/Comentario";
export default function tabClientesScreen() {
    const [data, setData] = useState<object>(); // dados que foram baixados da api
    const [msgError, setMsgErro] = useState();
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(useCallback(() => {
        setData(Cliente.findAll());
        console.log(Comentario.findAll())
        Cliente.syncronize()
            .then(item => {
                console.log(item)
                if (item.length != 0) setData(item)
                else {
                    setMsgErro(['Sem usuarios cadastrados'])
                    setData(null)
                }
            }).catch(e => {
                console.log("errr", e)
            });

    }, []))

    const onRefresh = () => {
        setRefreshing(true)

        setData(Cliente.findAll());
        Cliente.syncronize()
            .then(item => {
                if (item.length != 0) setData(item)
                else {
                    setMsgErro(['Sem usuarios cadastrados'])
                    setData(null)
                }
            }).catch(e => e);
        setRefreshing(false)
    }


    return (
        <View style={styles.container}>
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
                        <Text style={styles.title}>Sincronizado</Text>
                        {
                            data.map((item, index) => (
                                <Clientes key={`clientes-${index}`} data={item} />
                            ))
                        }
                    </View>

                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 14
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        padding: 8
    }
})