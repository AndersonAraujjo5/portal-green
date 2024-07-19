import { checkList } from "@/assets/images";
import Clientes from "@/components/Cliente";
import SafeStatusBar from "@/components/SafeStatusBar";
import Colors from "@/constants/Colors";
import LoginBD from "@/database/LoginBD";
import PreCadastro from "@/database/PreCadastro";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";


export default function tabHomeScreen() {
    const { nome } = LoginBD.find()?.usuario;

    const handleCadFisica = () => {
        router.replace('/tabs/cadastro/fisica')
    }


    return (
        <SafeStatusBar safe={false} style={'light'}>
            <ScrollView>
                <View style={styles.card}>
                    <Text style={{ color: "white" }}>Olá</Text>
                    <Text style={styles.nome}>{nome}</Text>

                    {/* input e filtro */}
                    <View style={styles.search}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name="search1" size={16} />
                            <TextInput style={{ marginLeft: 8 }} placeholder="Pesquisa" />
                        </View>
                        <TouchableOpacity>
                            <Entypo name="sound-mix" size={16} />
                        </TouchableOpacity>
                    </View>

                    {/* btn de cadastro */}

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
                            }}>
                                <Text style={{ color: "white" }}>Pessoa Jurídica</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                        PreCadastro.findAll()?.length === 0 &&
                        <>
                            <View style={{paddingVertical:22}}>
                                <Image style={{
                                    width: 300, height: 200, resizeMode: 'contain',

                                }} source={checkList} />
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: 18,
                                    fontWeight: "bold"
                                }}>Cadastros Sincronizado</Text>
                            </View>
                        </>
                    }

                    {
                        PreCadastro.findAll()?.length !== 0 &&
                        <>
                            <Text style={{ marginVertical: 18 }}> Aguardando a sincronização {PreCadastro.findAll()?.length}</Text>
                            {
                                PreCadastro.findAll()?.map(item => (
                                    <Clientes data={item} key={`${item.id}-cliente`} />
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