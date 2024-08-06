import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { statusColor } from "./Map";

function Clientes({ data, nav=true }: any) {
    const { cliente, nome, endereco, casa, bairro, cidade, status,
        id, vencimento, associado, plano, fatura}: any = data;
    
    const vars = ["pppoe", 'tecnico',
        "telefone", "plano", "fidelidade"];
    
    const handlePress = () => {
        if(!nav) return;
        router.push(`/clienteInfo/${id}`)
    }
    return (
        <>
            <Pressable style={{
                 flex:1,
                 paddingHorizontal: 12,
                 marginTop: 4,
            }} 
            onPress={handlePress}>
                <View style={{
                        borderWidth: 1,
                        borderColor: statusColor(status, fatura),
                        paddingVertical: 18,
                        paddingHorizontal: 12,
                        marginTop: 12,
                        borderRadius: 18,
                    }}>
                        <Text style={{fontSize: 12}}>{status}</Text>
                        <Text style={{fontSize: 22, fontWeight:"bold", marginVertical: 4}}>{cliente || nome}</Text>
                        {associado && <Text>Vendedo: {associado}</Text>}
                        {
                            
                            vars.map((item) => {
                                if (data[item]) return (<Text key={`${item}-${id}`}>{[item]}: {data[item]}</Text>)
                            })
                        }
                        <Text>Vencimento: {vencimento} - Com carnê</Text>
                        <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                        <Text>Plano: {plano}</Text>
                        
                    </View>
              
            </Pressable >
        </>
    )
}



export default Clientes;