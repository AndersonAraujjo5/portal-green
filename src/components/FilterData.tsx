import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import Filtro from "@/database/Filtro";
import { api } from "@/service/api";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

const { width, height } = Dimensions.get("window")

export default function FilterData({setData, filter}) {
    const [visible, setVisible] = useState(false);
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
        if(!date) return getDateAtual();
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

    const handlePesquisar =  () => {
        console.log(`/v1/cliente?dataInicio=${formatDate(dataIni)}&dataFim=${formatDate(dataFin)}`)
        api.get(`/v1/cliente?dataInicio=${formatDate(dataIni)}&dataFim=${formatDate(dataFin)}`).
        then(({data}) => {
            setData(data.data)
           Cliente.addAndRewrite(data.data)
        }).catch(erro => {
            console.log("error",erro)
        })
        filter(true)
        Filtro.add({dataIni, dataFin});
    }

    return (
        <>
            <Pressable onPress={() => setVisible(!visible)}>
                <AntDesign name="calendar" size={25} />
            </Pressable>
            {
                visible &&
                <View style={styles.container}>
                    <Pressable onPress={() => setVisible(!visible)} style={styles.background}></Pressable>
                    <View style={styles.modal}>
                        <View>

                            <View style={{
                                marginTop: 8,
                                display: "flex",
                                flexDirection: "row",
                                margin: "auto",
                                alignItems: "center"
                            }}>
                                <View style={{
                                    flexDirection: "column",
                                    width: "33%",

                                }}>
                                    <Text>Data Inicial</Text>
                                    <MaskInput
                                        mask={Masks.DATE_DDMMYYYY}
                                        style={styles.inputDate}
                                        value={dataIni}
                                        onChangeText={(value) => setDataIni(value)} />
                                </View>
                                <View style={{
                                    width: "33%"
                                }}>
                                    <Text>Data Final</Text>
                                    <MaskInput
                                        mask={Masks.DATE_DDMMYYYY}
                                        style={styles.inputDate}
                                        value={dataFin}
                                        onChangeText={(value) => setDataFin(value)} />
                                </View>
                                <Pressable
                                onPress={handlePesquisar}
                                style={styles.btnPresquisar}>
                                    <Text style={{ color: "white" }}>Pesquisar</Text>
                                </Pressable>
                            </View>
                        </View>

                    </View>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 16,
        flex: 1,
        width: width,
        position: "relative"
    },
    background: {
        position: "absolute",
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
        padding: 8,
        position: "absolute",
        backgroundColor: "white",
        zIndex: 30,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        height: 80,
    },
    inputDate: {
        width: "100%",
        borderColor: Colors.gray,
        padding: 4,
    },
    btnPresquisar: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.green,
    }
})