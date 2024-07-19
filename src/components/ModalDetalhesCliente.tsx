import ButtonAction from "@/components/ButtonActions";
import { Dimensions, View, ScrollView, Text, Image, TextInput, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CacherImage from "./CacherImage";

export default function ModalDetalhesCliente({ nome,cliente, pppoe, endereco, casa, bairro, velocidade, fidelidade, info, cidade,
    cep, tecnico, email, telefone, cordenadas, status, plano, vencimento, Fotos, Comentarios, associado, id, fatura
}: any, update: any) {
    const { width } = Dimensions.get('window');
    const vars = ["pppoe", "telefone", "email", "plano", "fidelidade", "vencimento", "tecnico"];
    const obj: any = { pppoe, telefone, email, plano, fidelidade, vencimento, tecnico };

    return (
    
            <View style={styles.contianer}>
                <ScrollView style={{
                    flex: 1,
                    paddingRight: 8, paddingLeft: 8,
                    borderTopRightRadius:8,
                    borderTopLeftRadius: 8,
                    backgroundColor:"white"
                }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>{cliente || nome}</Text>
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
                    <Text style={{marginBottom: 18}}>Mais info: {info} </Text>
                    <ButtonAction fatura={fatura} tecnico={tecnico} update={update} id={id} cordenadas={cordenadas} status={status} />
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
                            Fotos && Fotos.map((item, index) => (
                                <CacherImage url={item.url} width={width} key={index} />
                            ))
                        }
                    </ScrollView>

                    {
                        Comentarios && Comentarios.map((item: any) => (
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
        position: "absolute",
        width: '100%',
        height: 384,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        bottom: 0,
        backgroundColor: "rgba(174, 174, 174, 0.5)",
        paddingTop: 4,
        zIndex: 50
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