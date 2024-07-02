import ProfileUser from "@/components/ProfileUser";
import LoginBD from "@/database/LoginBD";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Button, Text } from "react-native";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";

export default function tabPerfilScreen() {
    const handleLogout = () => {
        LoginBD.delete();
        router.replace('/')
    }
    return (
        <ScrollView className="flex-1 py-5 mx-2">
            {/* <ProfileUser /> */}
            <Link href={'../donwloadMapa'} className="w-full bg-white py-3 my-5 px-2 rounded-lg">
                <View className="flex-row  items-center gap-3">
                    <AntDesign name="clouddownload" size={25} />
                    <Text>Baixar mapa para usar offline</Text>
                </View>
            </Link>
            <View className="flex-1">
               <Button onPress={handleLogout} title={'logout'} /> 
            </View>
        </ScrollView>
    )
}