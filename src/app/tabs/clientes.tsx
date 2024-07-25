import { Text, View, ScrollView, RefreshControl, Dimensions, Image } from "react-native";
import Clientes from "@/components/Cliente";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import Loader from "@/components/Loader";
import Cliente from "@/database/Cliente";
import Comentario from "@/database/Comentario";
import SafeStatusBar from "@/components/SafeStatusBar";
import PreCadastro from "@/database/PreCadastro";
import Status from "@/database/Status";
import Filtro from "@/database/Filtro";
import Filter from "@/components/Filter";
import { nodata } from "@/assets/images";

const { width, height } = Dimensions.get("window")

export default function tabClientesScreen() {
    const [data, setData] = useState<object>(); // dados que foram baixados da api
    const [msgError, setMsgErro] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [isFilter, setIsFilter] = useState(Filtro.find().filter)

    const syncronize = () => {
        PreCadastro.asyncEnviar();
        Comentario.asyncEnviar()
        Status.asyncEnviar();
     
        if (Filtro.find().filter) { // se tiver filtro não consulta todos os dados
            if (Cliente.findAll()) setData(Cliente.findAll())
            else setData([])
            return;
        };

        Cliente.syncronize()
            .then(item => {
                if (item.length != 0) {
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
        setMsgErro(null)
    }, []))


    const onRefresh = () => {
        setMsgErro(null)
        setRefreshing(true)
        syncronize();
        setRefreshing(false)
    }

    const NoData = () => {
        return(
            <View style={{
                paddingVertical: 22, flex: 1, display: "flex",
                alignItems: "center", justifyContent: 'center'
            }}>
                <View >
                    <Image style={{
                        margin: 'auto',
                        width: 128, height: 128, resizeMode: 'contain',
                    }} source={nodata} />
                    <Text style={{
                        textAlign: "center",
                        fontSize: 18,
                        fontWeight: "bold", marginTop: 4
                    }}>Sem informações disponiveis</Text>
                </View>
            </View>
        )
    }
    

    if(!data && !msgError) {
        return <Loader show={true} />
    }

    return (
        <SafeStatusBar safe={false} style={'light'}>

            {
                !data && <NoData/>
            }

            {
                data &&
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing}
                        onRefresh={onRefresh} />}>
                    <Filter setData={setData} setMsgErro={setMsgErro} setFilter={setIsFilter} msgError={setMsgErro} />
                    <View style={{ minHeight: height, paddingBottom: 18 }}>
                        {
                            msgError &&
                            msgError.map((e, i) => <Text key={i}
                                style={{
                                    fontSize: 24, lineHeight: 32, textAlign: 'center',
                                    marginTop: 50
                                }}>{e}</Text>)
                        }
                        {
                            data.length === 0 &&
                            <NoData/>
                        }
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
