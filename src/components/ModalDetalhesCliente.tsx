import ButtonAction from "@/components/ButtonActions";
import { Dimensions, View, ScrollView, Text, Image, TextInput, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CacherImage from "./CacherImage";

export default function ModalDetalhesCliente({ cliente, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
    cep, tecnico, email, telefone, cordenadas, status, plano, vencimento, Fotos, Comentarios, associado, id
}: any, update: any) {

    const { width } = Dimensions.get('window');
    const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento"];
    const obj: any = { pppoe, telefone, email, plano, fidelidade, vencimento };

    return (
        <View style={styles.contianer}>
            <ScrollView style={{
                paddingRight: 8, paddingLeft: 8
            }}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{cliente}</Text>
                <Text>Status: {status}</Text>
                <Text>Vendedor: {associado}</Text>
                <Text>{endereco}, {casa} – {bairro} - {cidade} - {cep}</Text>
                {
                    vars.map((item, index) => {
                        if (obj[item]) {
                            return <Text key={`${item}-${index}`}>{[item].toString().toLowerCase()}: {obj[item]}</Text>
                        }
                    })
                }
                <Text>Mais info: {tecnico} </Text>
                <ButtonAction tecnico={tecnico} update={update} id={id} cordenadas={cordenadas} status={status} />
                <ScrollView
                    style={{
                        paddingRight: 8,
                        paddingLeft: 8,
                        marginTop: 20,
                        marginBottom: 20
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {
                        Fotos.map((item, index) => (
                            <CacherImage url={item.url} width={width} key={index} />
                        ))
                    }
                </ScrollView>

                {
                    Comentarios.map((item: any) => (
                        <View style={styles.containerComentario} key={`${item.id}-comentario`}>
                            <View style={styles.associado}>
                                <AntDesign style={{
                                    borderRadius: 9999,
                                    backgroundColor: '#e2e8f0'
                                }}
                                    name="user" size={25} />
                                <View>
                                    <Text>{item.associado}</Text>
                                    {/* <Text>{item.createAt}</Text> */}
                                </View>
                            </View>
                            {
                                (item.type == 'image' || item.type == 'file') &&
                                item.url.length != 0 &&
                                <Image
                                    style={{
                                        margin: 8,
                                        borderRadius: 8,
                                    }}
                                
                                    width={width / 2} height={200}
                                    source={{ uri: item.url }}
                                    resizeMode="contain"
                                />
                            }
                            <Text style={{
                                marginTop: 8,
                                marginBottom: 8
                            }}>{item.body}</Text>
                        </View>
                    ))
                }

            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    contianer: {
        width: '100%',
        height: 384,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'white',
        bottom: 192,
        paddingTop: 20,
        paddingBottom: 20
    },
    title: {
        fontSize: 20,
        lineHeight: 28,
        marginTop: 8,
        marginBottom: 8,
        fontWeight: 'bold'
    },
    containerComentario: {
        borderBottomWidth: 2,
        marginTop: 8,
        marginBottom: 8
    },
    associado: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    }
})