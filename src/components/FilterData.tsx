import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import Filtro from "@/database/Filtro";
import { api } from "@/service/api";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

const { width, height } = Dimensions.get("window")

export default function FilterData({ setData, filter }) {
    const [dataIni, setDataIni] = useState(Filtro.find().dataIni)
    const [dataFin, setDataFin] = useState(Filtro.find().dataFin)

    const getDateAtual = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const formatDate = (date) => {
        if (!date) return getDateAtual();
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = date.match(datePattern);

        if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return getDateAtual();
    }

    const handlePesquisar = () => {
        api.get(`/v1/cliente?dataInicio=${formatDate(dataIni)}&dataFim=${formatDate(dataFin)}`).
            then(({ data }) => {
                setData(data.data)
                Cliente.addAndRewrite(data.data)
            }).catch(erro => {
                console.log("error", erro)
            })
        filter(true)
        Filtro.add({ dataIni, dataFin });
    }

    return (
        <>


                <View style={styles.modal}>
                    <View>
                    <Text style={{width: "40%"}}>Filtro por Data:</Text>
                        
                        <View style={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "row",
                            margin: "auto",
                            alignItems: "center",
                            justifyContent:"space-between"
                        }}>
                                <Text>Inicial:  </Text>

                            <View style={{
                                flexDirection: "column",
                                width: "40%",
                            }}>
                                <MaskInput
                                    mask={Masks.DATE_DDMMYYYY}
                                    style={styles.inputDate}
                                    value={dataIni}
                                    onChangeText={(value) => setDataIni(value)} />
                            </View>
                            <Text>Final:  </Text>

                            <View style={{
                                width: "40%"
                            }}>
                                <MaskInput
                                    mask={Masks.DATE_DDMMYYYY}
                                    style={styles.inputDate}
                                    value={dataFin}
                                    onChangeText={(value) => setDataFin(value)} />
                            </View>
                       </View>
                    </View>

                </View>
     
        </>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(156, 163, 175,0.5)',
        top: 0,
        right: 0,
        width,
        height,
        zIndex: 20
    },
    modal: {
        right: 0,
        width,
        paddingHorizontal: 12,
        paddingVertical:18,
        zIndex: 30,
        height: 80,
    },
    inputDate: {
        width: "100%",
        borderColor: Colors.gray,
        padding: 4,
        fontSize:22
    },
    btnPresquisar: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.green,
    }
})