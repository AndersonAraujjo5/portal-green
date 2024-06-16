import { FlatList, Text, View } from "react-native";
import Clientes from "@/components/Cliente";
export default function tabClientesScreen(){
    const data = [
        {
            id:1,
            nome:'Anderson Tailon',
            endereco: "Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA",
            data:'11-04-2002',
            status:'pendente'
        },
        {
            id:2,
            nome:'Anderson Tailon',
            endereco: "Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA",
            data:'11-04-2002',
            status:'pendente'
        },
        {
            id:3,
            nome:'Anderson Tailon',
            endereco: "Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA",
            data:'11-04-2002',
            status:'pendente'
        }
    ]
    return(
        <View className="flex-1 mt-5">
            <FlatList
                data={data}
                renderItem={()=> (
                    <Clientes />
                )}
                keyExtractor={item => item.id.toString()}
            />
      
        </View>
    )
}