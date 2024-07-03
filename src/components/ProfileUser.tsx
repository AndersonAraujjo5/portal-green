import { StyleSheet, Text, View } from "react-native";

export default function ProfileUser() {
    return (
        <View style={style.container}>
            <View style={style.box}>
                <Text style={style.number}>90</Text>
                <Text style={style.text}>Cadastrado</Text>
            </View>
            <View style={style.box}>
                <Text style={style.number}>90</Text>
                <Text style={style.text}>cancelado</Text>
            </View>
            <View style={style.box}>
                <Text style={style.number}>90</Text>
                <Text style={style.text}>finalizado</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: "white",
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 8
    },
    box:{
        alignItems:'center'
    },
    number:{
        fontSize: 24,
        lineHeight: 32
    },
    text:{
        fontSize: 14,
        lineHeight: 20 
    }
})