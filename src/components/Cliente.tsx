import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import ButtonAction from "@/components/ButtonActions";

function Clientes({ data }: any) {
    const { nome, endereco, casa, bairro, cidade, status, id }: any = data;
    const vars = ["pppoe",
        "telefone", "email", "plano", "fidelidade", "vencimento"];

    return (
        <Link href={{
            pathname: `/clienteInfo/[id]`,
            params: {id}
        }} className="w-full bg-white my-2">
            <View className="flex-row justify-around items-center p-4">
                <View className="flex-1 w-full">
                    <Text className="text-xl font-bold">{nome}</Text>
                    <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                    {
                        vars.map((item, index) => (
                            data[item] && <Text key={`${item}-${index}`}>{data[item]}</Text>
                        ))
                    }
                    <Text className="text-xl text-yellow-400">{status}</Text>
                    <ButtonAction cordenadas={[-1.1964, -47.1816]} status={"Cadastro Enviado"} />
                </View>
            </View>
        </Link>
    )
}




export default Clientes;