import { forma } from "@/assets/images";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, TouchableOpacity, } from "react-native";
import { Text } from "react-native";
import { TextInput, View } from "react-native";
import { api } from '@/service/api'
import LoginBD, { LoginProps } from "@/database/LoginBD";
import { Redirect, router } from "expo-router";
import Loader from "@/components/Loader";
import Cliente from "@/database/Cliente";
import SafeStatusBar from "@/components/SafeStatusBar";
import Filtro from "@/database/Filtro";


export default function login() {
    const [login, setLogin] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string[] | null>();
    const [loader, setLoader] = useState(false)
    const handleSign = async () => {
        setLoader(true)
        try {
            const { data } = await api.post<LoginProps>('/v1/auth/login', {
                login, password,
            })

            api.defaults.headers['Authorization'] = `Bearer ${data.token}`;
            LoginBD.add(data)
            return router.replace('/tabs/home')
        } catch (error) {
            setLoader(false)
            if (error && error.data) {
                setError(error.data.errors)
                return;
            }

            if (error && error?.errors) setError(['Ops, tente novamente mais tarde ou tente em contato com o administrador'])
            else setError(['Erro desconecido'])

        }
    }

    if (LoginBD.find()) {
        if (!Filtro.find().filter) {
            Cliente.syncronize().catch(e => e)
        }

        // return <Redirect href={'/tabs/cadastro/juridico'} />
        return <Redirect href={'/tabs/home'} />
    }

    useEffect(() => {
        if (error) setError(null)
    }, [login, password])

    return (
        <SafeStatusBar>
            <View style={{ justifyContent: "center", display: "flex", flex: 1, paddingRight: 20, paddingLeft: 20 }}>
                <Loader show={loader} />
                <View style={styles.imgTop}>
                    <Image style={{ width: 500, height: 500, resizeMode: "contain" }} source={forma} />
                </View>
                <View style={styles.imgBottom}>
                    <Image style={{ width: 500, height: 500, resizeMode: "contain" }} source={forma} />
                </View>
                <Text style={styles.title}>Faça o login</Text>

                <View style={styles.containerInput}>
                    {
                        error &&
                        <View style={styles.error}>
                            {
                                error.map((item, index) => (
                                    <Text key={index} style={styles.errorText}>{item}</Text>

                                ))
                            }
                        </View>
                    }

                    <Text style={{ marginTop: 10 }}>Usuário</Text>
                    <View style={styles.boxInput}>
                        <AntDesign
                            style={styles.icon}
                            name="user"
                            color={Colors.gray}
                            size={18} />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setLogin(text)} />
                    </View>
                </View>
                <View style={styles.containerInput}>
                    <Text>Senha</Text>
                    <View style={styles.boxInput}>
                        <AntDesign
                            style={styles.icon}
                            name="lock1"
                            color={Colors.gray}
                            size={18} />
                        <TextInput
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={styles.input} />
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    Alert.alert("ATENÇÃO","Entre em contato com o administrador")
                }}>
                    <Text style={{ textAlign: 'right' }}>Esqueci minha senha</Text>
                </TouchableOpacity>
                <View style={{ width: '100%' }}>
                    <Pressable style={styles.button}
                        onPress={handleSign}
                    >
                        <Text
                            style={{ textAlign: 'center', color: 'white' }}>Entrar</Text>
                    </Pressable>
                </View>
            </View>
        </SafeStatusBar>
    )
}

const styles = StyleSheet.create({
    imgTop: {
        position: 'absolute',
        top: -288,
        left: 144
    },
    imgBottom: {
        position: 'absolute',
        bottom: -288,
        right: 0
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.green
    },
    containerInput: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderColor: '#4b5563'
    },
    error: {
        backgroundColor: '#ef4444',
        marginBottom: 10,
        marginTop: 20,
        padding: 20
    },
    errorText: {
        color: 'white'
    },
    boxInput: {
        flexDirection: 'row',
        marginTop: 8
    },
    icon: {
        padding: 8
    },
    input: {
        width: '100%'
    },
    button: {
        width: '100%',
        borderRadius: 16,
        padding: 8,
        marginTop: 44,
        backgroundColor: Colors.gray
    }
})