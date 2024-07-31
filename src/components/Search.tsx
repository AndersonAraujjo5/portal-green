import Cliente from "@/database/Cliente";
import Filtro from "@/database/Filtro";
import { api } from "@/service/api";
import { AntDesign } from "@expo/vector-icons";
import { View } from "moti";
import { TextInput } from "react-native";

export default function Search({ setData, filter }: any) {
    const handlePesquisar = (value) => {
        api.get(`/v1/cliente?search=${value}`).
            then(({ data }) => {
                setData(data.data)
                Cliente.addAndRewrite(data.data)
            }).catch(erro => {
                console.log("error", erro)
            })
        filter(true)
        Filtro.add({ pesquisa: value });
    }
    return <>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="search1" size={16} />
            <TextInput onChangeText={handlePesquisar} style={{ marginLeft: 8,height: 32, width: '88%' }} placeholder="Pesquisa" />
        </View>
    </>
}