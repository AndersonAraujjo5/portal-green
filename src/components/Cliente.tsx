import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import ButtonAction from "@/components/ButtonActions";

function Clientes({ data, access }: any) {
    const { cliente, nome, endereco, casa, bairro, cidade, status,
        id, cordenadas, tecnico }: any = data;
        
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
                    } style={styles.container} >
                        <View style={styles.box}>
                            <View>
                                <Text style={styles.title}>{cliente || nome}</Text>
                                <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                                {
                                    vars.map((item, index) => {
                                        if (data[item]) return (<Text key={`${item}-${index}`}>{[item]}: {data[item]}</Text>)
                                    })
                                }
                                <Text style={styles.text}>{status}</Text>

                            </View>
                           
                        </View>
                    </Link >
                    :
                    <View style={styles.container} >
                        <View style={styles.box}>
                            <View>
                                <Text style={styles.title}>{cliente || nome}</Text>
                                <Text>{endereco}, {casa} – {bairro} {cidade} </Text>
                                {
                                    vars.map((item, index) => {
                                        if (data[item]) return (<Text key={`${item}-${index}`}>{[item]}: {data[item]}</Text>)
                                    })
                                }
                                <Text style={styles.text}>{status}</Text>

                            </View>
                        </View>
                    </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 8,
        marginBottom: 8,
        paddingTop: 4,
        paddingBottom: 18,
        backgroundColor: 'white',
    },
    box: {
        paddingLeft: 8,
        paddingRight: 16
    },
    text: {
        marginBottom: 10,
        fontSize: 20,
        lineHeight: 28,
    },
    title: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: "bold"
    }
})



export default Clientes;