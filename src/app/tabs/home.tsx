import SafeStatusBar from "@/components/SafeStatusBar";
import Colors from "@/constants/Colors";
import LoginBD from "@/database/LoginBD";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

function Nav({text, url, children}: any){
    return(
        <View>
            <View style={{
                width: '100%',
                height:'100%',
                alignItems:"center",
                justifyContent:"center",
            }}>{children}</View>
            <Text>{text}</Text>
        </View>
    )
}


export default function tabHomeScreen(){
    const {nome} = LoginBD.find()?.usuario;
    return(
        <SafeStatusBar>
            <ScrollView>
                <View style={styles.card}>
                    <Text style={{color:"white"}}>Olá</Text>
                    <Text style={styles.nome}>{nome}</Text>

                {/* input e filtro */}
                    <View style={styles.search}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <AntDesign name="search1" size={16}/>
                            <TextInput style={{marginLeft:8}} placeholder="Pesquisa" />
                        </View>
                        <TouchableOpacity>
                            <Entypo name="sound-mix" size={16}/>
                        </TouchableOpacity>
                    </View>

                    {/* btn de cadastro */}
                    <View style={styles.boxNav}>
                        <View style={styles.cardNav}>
                            <TouchableOpacity style={{
                                justifyContent:"center",
                                alignItems:"center",
                                alignContent:"center",
                                width: '45%',
                                borderRadius: 32,
                                paddingVertical:12,
                                backgroundColor: Colors.gray
                            }}>
                                <Text style={{color:"white"}}>Pessoa Físicas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                justifyContent:"center",
                                alignItems:"center",
                                alignContent:"center",
                                width: '45%',
                                borderRadius: 32,
                                paddingVertical:12,
                                backgroundColor: Colors.gray
                            }}>
                                <Text style={{color:"white"}}>Pessoa Jurídica</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            {/* Cientes */}
                <View
                style={{
                    borderTopLeftRadius: 18,
                    borderTopRightRadius:18,
                    paddingHorizontal: 12,
                    paddingBottom: 22,
                    marginTop: 44,
                    backgroundColor:"white"
                }}>
                    <Text style={{marginVertical: 18}}> Aguardando a sincronização</Text>
                    
                    <View style={{
                        borderWidth: 1,
                        borderColor: Colors.green,
                        paddingVertical: 18,
                        paddingHorizontal: 12,
                        borderRadius: 18
                    }}>
                        <Text style={{fontSize: 12}}>Sincronização pendente</Text>
                        <Text style={{fontSize: 22, fontWeight:"bold", marginVertical: 4}}>Anderson Araujo</Text>
                        <Text>Telefone:(91) 99603-1077</Text>
                        <Text>Vencimento: 10    -    Com Carnê</Text>
                        <Text>Tv 14 de março, 442, - Centro Capanema</Text>
                        <Text>Plano: Conexão Verde - 400MB - Com Fidelidade</Text>

                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: Colors.green,
                        paddingVertical: 18,
                        paddingHorizontal: 12,
                        borderRadius: 18,
                        marginTop: 12,
                    }}>
                        <Text style={{fontSize: 12}}>Sincronização pendente</Text>
                        <Text style={{fontSize: 22, fontWeight:"bold", marginVertical: 4}}>Anderson Araujo</Text>
                        <Text>Telefone:(91) 99603-1077</Text>
                        <Text>Vencimento: 10    -    Com Carnê</Text>
                        <Text>Tv 14 de março, 442, - Centro Capanema</Text>
                        <Text>Plano: Conexão Verde - 400MB - Com Fidelidade</Text>

                    </View>

                    <View style={{
                        borderWidth: 1,
                        borderColor: Colors.green,
                        paddingVertical: 18,
                        paddingHorizontal: 12,
                        marginTop: 12,
                        borderRadius: 18,
                    }}>
                        <Text style={{fontSize: 12}}>Sincronização pendente</Text>
                        <Text style={{fontSize: 22, fontWeight:"bold", marginVertical: 4}}>Anderson Araujo</Text>
                        <Text>Telefone:(91) 99603-1077</Text>
                        <Text>Vencimento: 10    -    Com Carnê</Text>
                        <Text>Tv 14 de março, 442, - Centro Capanema</Text>
                        <Text>Plano: Conexão Verde - 400MB - Com Fidelidade</Text>

                    </View>
                    
                </View>
            </ScrollView>
        </SafeStatusBar>
    )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: Colors.green,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 12,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40
    },
    nome:{
        color: "white",
        fontWeight:"bold",
        fontSize: 18,
        lineHeight: 24,
    },
    search: {
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        marginVertical: 28,
        backgroundColor:"white",
        borderRadius: 12,
        paddingVertical:4,
        paddingHorizontal: 12
    },
    input:{
        paddingVertical:8,
        paddingHorizontal:12
    },
    boxNav:{
        position:"relative",
        paddingVertical:24,
        alignItems:"center"
    },
    cardNav:{
        width:'100%',
        flexDirection:"row",
        justifyContent:"space-around",
        position:"absolute",
        backgroundColor:"white",
        paddingVertical:20,
        paddingHorizontal:12,
        borderRadius: 12,
        borderBottomWidth: 4,
        borderColor: 'rgba(200,200,200,0.5)',
    }
})