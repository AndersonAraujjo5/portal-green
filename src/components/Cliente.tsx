import { Link } from "expo-router";
import { Text } from "react-native";
import { View } from "react-native";

function Clientes(){
    return(
        <Link href={'/clienteInfo/10'} className="w-full bg-white my-2">
            <View className="flex-row justify-around items-center p-4">
                <View className="flex-1 w-full">
                    <Text className="text-2xl font-bold">Anderson Tailon</Text>
                    <Text>Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA </Text>
                    <Text>PPPOE:teste@greenet.net.br</Text>
                    <Text>Pendente para sincronização</Text>
                </View>
            </View>
        </Link> 
    )
}




export default Clientes;