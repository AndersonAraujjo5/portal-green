import ProfileUser from "@/components/ProfileUser";
import { Link } from "expo-router";
import { View } from "react-native";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

export default function tabPerfilScreen(){
    return(
        <ScrollView className="flex-1 pt-14 mx-2">
            <ProfileUser />
            <View className="w-full border-b-2">
                <Link href={'../donwloadMapa'}>Mapa offline</Link>
            </View>
        </ScrollView>
    )
}