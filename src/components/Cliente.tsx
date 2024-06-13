import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

function Clientes(){
    return(
        <View className="w-full my-3 bg-yellow-400">
            <View className="flex-row justify-around items-center p-4">
                <View className="flex-1 w-full">
                    <Text className="text-2xl font-bold">Anderson Tailon</Text>
                    <Text>Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA </Text>
                    <Text>PPPOE:teste@greenet.net.br</Text>
                    <Text>Pendente para sincronização</Text>
                </View>
            </View>
        </View> 
    )
}




export default Clientes;