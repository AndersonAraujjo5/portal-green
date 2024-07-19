import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import Filtro from "@/database/Filtro";
import { api } from "@/service/api";
import { StyleSheet, TextInput } from "react-native";

export default function Search({setData, filter}:any) {
      const handlePesquisar =  (value) => {
        api.get(`/v1/cliente?search=${value}`).
        then(({data}) => {
            setData(data.data)
           Cliente.addAndRewrite(data.data)
        }).catch(erro => {
            console.log("error",erro)
        })
        filter(true)
        Filtro.add({pesquisa: value});
    }
    return <>
        <TextInput onChangeText={handlePesquisar} style={styles.search} placeholder="Pesquisa" />
    </>
}

const styles = StyleSheet.create({
    search: {
        width: '85%',
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: Colors.gray,
        borderRadius: 18,
        paddingLeft: 12,

    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        padding: 8
    }
})