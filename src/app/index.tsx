import { forma } from "@/assets/images";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, } from "react-native";
import { Text } from "react-native";
import { TextInput, View } from "react-native";
import { api } from '@/service/api'
import LoginBD, { LoginProps } from "@/database/LoginBD";
import { Redirect, router } from "expo-router";
import CadastroBD from "@/database/CadastroBD";
import Loader from "@/components/Loader";


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
            LoginBD.add(data)
            router.replace('/tabs/cadastro')
        } catch (error) {
            setLoader(false)
            if (error && error.data) {
                setError(error.data.errors)
                return;
            }

            if(error && error?.errors) setError(['Ops, tente novamente mais tarde ou tente em contato com o administrador']) 
            else setError(['Erro desconecido'])
            
        }
    }

    if(LoginBD.find()){
        CadastroBD.synchronize(); // sincroniza os dados envia/recebe

        return <Redirect href={'/tabs/cadastro'} />
    }

    useEffect(() => {
        if(error) setError(null)
    },[login, password])

    return (
        <View className="flex-1 flex justify-center p-5">
            <Loader show={loader} />
            <View className="absolute -top-72 left-36">
                <Image style={{ width: 500, height: 500, resizeMode: "contain" }} source={forma} />
            </View>
            <View className="absolute -bottom-72 right-0">
                <Image style={{ width: 500, height: 500, resizeMode: "contain" }} source={forma} />
            </View>
            <Text className="text-2xl font-bold" style={{ color: Colors.green }}>Faça o login</Text>

            <View className="my-6 border-b border-gray-600">
                {
                    error &&
                    <View className="bg-red-500 my-5 p-5">
                        {
                            error.map((item,index) => (
                                <Text key={index} className="text-white">{item}</Text>

                            ))
                        }
                    </View>
                }

                <Text >Usuário</Text>
                <View className="flex-row mt-2">
                    <AntDesign
                        className="p-2"
                        name="user"
                        color={Colors.gray}
                        size={18} />
                    <TextInput
                        className="w-full"
                        onChangeText={(text) => setLogin(text)} />
                </View>
            </View>
            <View className="border-b border-gray-500">
                <Text className="text-gray-600">Senha</Text>
                <View className="flex-row mt-2">
                    <AntDesign
                        className="p-2 color-gray-500"
                        name="lock1"
                        color={Colors.gray}
                        size={18} />
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                        className="w-full" />
                </View>
            </View>
            <View className="w-full">
                <Pressable className="w-ull rounded-2xl border-white p-3 mt-11" style={{
                    backgroundColor: Colors.gray
                }}
                    onPress={handleSign}
                >
                    <Text className="text-center text-white">Entrar</Text>
                </Pressable>
            </View>
        </View>
    )
}