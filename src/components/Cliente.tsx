import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

function Clientes({ data, nav=true }: any) {
    const { cliente, nome, endereco, casa, bairro, cidade, status,
        id, vencimento, associado, plano}: any = data;
    
    const vars = ["pppoe", 'tecnico',
        "telefone", "plano", "fidelidade"];
    
    const handlePress = () => {
        if(!nav) return;
        router.push(`/clienteInfo/${id}`)
    }
    return (
        <>
            <Pressable style={styles.container} 
            onPress={handlePress}>
                <View style={{
                        borderWidth: 1,
                        borderColor: Colors.green,
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

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal: 12,
        marginTop: 4,
    }
})



export default Clientes;