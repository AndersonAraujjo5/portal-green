import { forma } from "@/assets/images";
import Colors from "@/constants/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { Alert, Image, Pressable, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { api } from '@/service/api'
import LoginBD, { LoginProps } from "@/database/LoginBD";
import { Redirect, router } from "expo-router";
import Loader from "@/components/Loader";
import Cliente from "@/database/Cliente";
import SafeStatusBar from "@/components/SafeStatusBar";
import Filtro from "@/database/Filtro";

export default function Login() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string[] | null>(null);
    const [loader, setLoader] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Referências para os campos de entrada
    const passwordInputRef = useRef<TextInput>(null);

    const handleSign = async () => {
        setLoader(true);
        try {
            const getData = await fetch('https://api64.ipify.org/?format=json');
            const { ip } = await getData.json();

            const { data } = await api.post<LoginProps>('/v1/auth/login', {
                login, password, ip
            });

            api.defaults.headers['Authorization'] = `Bearer ${data.token}`;
            LoginBD.add(data);
            Cliente.syncronize();
            Filtro.delete();
            return router.replace('/tabs/home');
        } catch (error) {
            setLoader(false);
            if (error && error.data) {
                setError(error.data.errors);
                return;
            }

            if (error && error?.errors) setError(['Ops, tente novamente mais tarde ou tente em contato com o administrador']);
            else setError(['Erro desconhecido']);
        }
    };

    if (LoginBD.find()) {
        if (!Filtro.find().filter) {
            Cliente.syncronize().catch(e => e);
        }

        return <Redirect href={'/tabs/home'} />;
    }

    useEffect(() => {
        if (error) setError(null);
    }, [login, password]);

    return (
        <SafeStatusBar>
           
                <View style={styles.container}>
                    <Loader show={loader} />
                    <View style={styles.imgTop}>
                        <Image style={styles.image} source={forma} />
                    </View>
                    <View style={styles.imgBottom}>
                        <Image style={styles.image} source={forma} />
                    </View>
                    <Text style={styles.title}>Faça o login</Text>

                    <View style={styles.containerInput}>
                        {error && (
                            <View style={styles.error}>
                                {error.map((item, index) => (
                                    <Text key={index} style={styles.errorText}>{item}</Text>
                                ))}
                            </View>
                        )}

                        <Text style={styles.label}>Usuário</Text>
                        <View style={styles.boxInput}>
                            <AntDesign style={styles.icon} name="user" color={Colors.gray} size={18} />
                            <TextInput
                                style={styles.input}
                                onChangeText={setLogin}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInputRef.current?.focus()}
                            />
                        </View>
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.boxInput}>
                            <AntDesign style={styles.icon} name="lock1" color={Colors.gray} size={18} />
                            <TextInput
                                ref={passwordInputRef}
                                style={styles.input}
                                onChangeText={setPassword}
                                secureTextEntry={!passwordVisible}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={() => {
                                setPasswordVisible(!passwordVisible)
                            }}>
                                <MaterialIcons
                                    name={passwordVisible ? "visibility" : "visibility-off"}
                                    size={24}
                                    color={Colors.gray}

                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert("ATENÇÃO", "Entre em contato com o administrador")}>
                        <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={handleSign}>
                            <Text style={styles.buttonText}>Entrar</Text>
                        </Pressable>
                    </View>
                </View>
                
        </SafeStatusBar>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: 20,
    },
    imgTop: {
        position: 'absolute',
        top: -288,
        left: 144,
    },
    imgBottom: {
        position: 'absolute',
        bottom: -288,
        right: 0,
    },
    image: {
        width: 500,
        height: 500,
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.green,
    },
    containerInput: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderColor: '#4b5563',
    },
    error: {
        backgroundColor: '#ef4444',
        marginBottom: 10,
        marginTop: 20,
        padding: 20,
    },
    errorText: {
        color: 'white',
    },
    label: {
        marginTop: 10,
    },
    boxInput: {
        justifyContent: "space-between",
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    icon: {
        padding: 8,
    },
    input: {
        flex: 1
    },

    forgotPassword: {
        textAlign: 'right',
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        width: '100%',
        borderRadius: 16,
        padding: 8,
        marginTop: 44,
        backgroundColor: Colors.gray,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
});
