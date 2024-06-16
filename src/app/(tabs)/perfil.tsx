import ProfileUser from "@/components/ProfileUser";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text } from "react-native";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";

export default function tabPerfilScreen() {
    return (
        <ScrollView className="flex-1 py-5 mx-2">
            <ProfileUser />
            <Link href={'../donwloadMapa'} className="w-full bg-white py-3 my-5 px-2 rounded-lg">
                <Pressable className="flex-row  items-center gap-3">
                    <AntDesign name="clouddownload" size={25} />
                    <Text>Baixar mapa para usar offline</Text>
                </Pressable>
            </Link>
        </ScrollView>
    )
}