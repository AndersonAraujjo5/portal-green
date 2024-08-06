import Cliente from "@/database/Cliente";
import Filtro from "@/database/Filtro";
import { api } from "@/service/api";
import { AntDesign } from "@expo/vector-icons";
import { View } from "moti";
import { useRef } from "react";
import { Pressable, TextInput } from "react-native";

export default function Search({ setData, filter }: any) {
    const inputRef = useRef(null)
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

    const handleFocus = ()=>{
        if (inputRef.current) {
            inputRef.current.focus();
          }
    }

    return <>
        <Pressable onPress={handleFocus}
         style={{ flexDirection: "row", alignItems: "center", width: '80%' }}>
            <AntDesign name="search1" size={16} />
            <TextInput ref={inputRef} onChangeText={handlePesquisar} style={{ marginLeft: 8,height: 32 }} placeholder="Pesquisa" />
        </Pressable>
    </>
}