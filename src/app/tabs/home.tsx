import { checkList } from "@/assets/images";
import { ClienteStatus } from "@/components/ButtonActions";
import Clientes from "@/components/Cliente";
import SafeStatusBar from "@/components/SafeStatusBar";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import LoginBD from "@/database/LoginBD";
import PreCadastro from "@/database/PreCadastro";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";


export default function tabHomeScreen() {
    const [nome, setNome] = useState(LoginBD.find()?.usuario.nome)
    const [cargo, setCargo] = useState(LoginBD.find()?.usuario.cargo)
    const [length, setLength] = useState(PreCadastro.findAll()?.length);
    const [precadastro, setPrecadastro] = useState(PreCadastro.findAll())


    const handleCadFisica = () => {
        router.replace('/tabs/cadastro/fisica')
    }

    const handleCadJuridica = () => {
        router.replace('/tabs/cadastro/juridico')
    }


    useFocusEffect(useCallback(() => {
        setNome(LoginBD.find()?.usuario.nome);
        setCargo(LoginBD.find()?.usuario.cargo);
        setLength(PreCadastro.findAll()?.length);
        setPrecadastro(PreCadastro.findAll());
    }, []))

    const handlePressPendente = () => {
        router.push(`/tabs/mapa/${ClienteStatus.UsuarioCriado}`)
    }

    const handlePressCarne= () => {
        router.push(`/tabs/mapa/carnê`)
    }

    return (
        <SafeStatusBar safe={false} style={'light'}>
            <ScrollView>
                <View style={styles.card}>
                    <Text style={{ color: "white" }}>Olá</Text>
                    <Text style={styles.nome}>{nome}</Text>

                    {/* btn de cadastro */}

                    {
                        cargo === 'Vendedor' &&
                        <View style={styles.boxNav}>
                            <View style={styles.cardNav}>
                                <TouchableOpacity style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    width: '45%',
                                    borderRadius: 32,
                                    paddingVertical: 12,
                                    backgroundColor: Colors.gray
                                }}
                                    onPress={handleCadFisica}>
                                    <Text style={{ color: "white" }}>Pessoa Físicas</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    width: '45%',
                                    borderRadius: 32,
                                    paddingVertical: 12,
                                    backgroundColor: Colors.gray
                                }}
                                    onPress={handleCadJuridica}>
                                    <Text style={{ color: "white" }}>Pessoa Jurídica</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>

                {/* Cientes */}
                <View
                    style={{
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        paddingHorizontal: 12,
                        paddingBottom: 22,
                        marginTop: 44,
                        backgroundColor: "white"
                    }}>


                    {
                        cargo === 'Tecnico' &&
                        <View style={{
                            marginVertical: 12,
                            flexDirection: "row",
                            gap: 12
                        }}>
                            <View style={{
                                borderWidth: 1,
                                borderColor: Colors.green,
                                paddingVertical: 18,
                                paddingHorizontal: 12,
                                marginTop: 12,
                                borderRadius: 18,
                            }}>

                                <Text>Instalações pendentes</Text>
                                <Pressable onPress={handlePressPendente}>
                                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                        {
                                            Cliente.findBy((item: any) => {
                                                return item.status === ClienteStatus.UsuarioCriado
                                            })?.length
                                        }
                                    </Text>
                                </Pressable>

                            </View>

                            <View style={{
                                borderWidth: 1,
                                borderColor: Colors.green,
                                paddingVertical: 18,
                                paddingHorizontal: 12,
                                marginTop: 12,
                                borderRadius: 18,
                            }}>

                                <Text>Aguardando o carnê</Text>
                                <Pressable onPress={handlePressCarne}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{
                                    Cliente.findBy((item: any) => {
                                        return item.fatura == "Carnê" && item.status !== ClienteStatus.CarneEntregue
                                    })?.length
                                }</Text>
                                </Pressable>
                            </View>
                        </View>
                    }


                    {
                        cargo === 'Vendedor' &&
                        length === 0 &&
                        <>
                            <View style={{ paddingVertical: 22 }}>
                                <Image style={{
                                    margin: "auto",
                                    width: 128, height: 128, resizeMode: 'contain',

                                }} source={checkList} />
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 18,
                                    fontWeight: "bold", marginTop: 4
                                }}>Cadastros Sincronizado</Text>
                            </View>
                        </>
                    }

                    {
                        cargo === 'Vendedor' &&
                        length !== 0 &&
                        <>
                            <Text style={{ marginVertical: 18 }}> Aguardando a sincronização {length}</Text>
                            {
                                precadastro.map(item => (
                                    <Clientes data={item} nav={false} key={`${item.id}-cliente`} />
                                ))
                            }
                        </>
                    }



                </View>
            </ScrollView>
        </SafeStatusBar>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.green,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 12,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40
    },
    nome: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 32,
    },
    search: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 28,
        backgroundColor: "white",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    input: {
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    boxNav: {
        position: "relative",
        paddingVertical: 24,
        alignItems: "center"
    },
    cardNav: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderBottomWidth: 4,
        borderColor: 'rgba(200,200,200,0.5)',
    }
})