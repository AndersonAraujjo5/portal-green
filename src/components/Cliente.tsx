import { Link } from "expo-router";
import { View, Text } from "react-native";
import ButtonAction from "@/components/ButtonActions";

function Clientes({ data, access }: any) {
    const { cliente, nome, endereco, casa, bairro, cidade, status, id, cordenadas }: any = data;

    const vars = ["pppoe",
        "telefone", "email", "plano", "fidelidade", "vencimento"];

    return (
        <>
            {
                (cordenadas !== '' && cordenadas !== null && access != false) ?
                    <Link href={{
                        pathname: `/clienteInfo/[id]`,
                        params: { id }
                    }
                    } className="w-full my-2 bg-white" >
                        <View className="flex-row justify-around items-center p-4">
                            <View className="flex-1 w-full">
                                <Text className="text-xl font-bold">{cliente || nome}</Text>
                                <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                                {
                                    vars.map((item, index) => {
                                        if(data[item]) return (<Text key={`${item}-${index}`}>{[item]}: {data[item]}</Text>)
                                    })
                                }
                                <Text className="text-xl">{status}</Text>
                                {
                                    cordenadas &&
                                    <ButtonAction cordenadas={cordenadas} status={"Cadastro Enviado"} />
                                }
                            </View>
                        </View>
                    </Link >
                    :
                    <View className="w-full my-2 bg-white" >
                        <View className="flex-row justify-around items-center p-4">
                            <View className="flex-1 w-full">
                                <Text className="text-xl font-bold">{cliente || nome}</Text>
                                <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                                {
                                    vars.map((item, index) => {
                                        if(data[item]) return (<Text key={`${item}-${index}`}>{[item]}: {data[item]}</Text>)
                                    })
                                }
                                <Text className="text-xl">{status}</Text>
                                {
                                    cordenadas &&
                                    <ButtonAction cordenadas={cordenadas} status={"Cadastro Enviado"} />
                                }
                            </View>
                        </View>
                    </View>
            }
        </>
    )
}




export default Clientes;