import SafeStatusBar from "@/components/SafeStatusBar";
import Colors from "@/constants/Colors";
import LoginBD from "@/database/LoginBD";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native";
import { View, ScrollView } from "react-native";

export default function tabPerfilScreen() {
    const handleLogout = () => {
        LoginBD.delete();
        router.replace('/')
    }
    return (
        <SafeStatusBar>
            <ScrollView style={styles.container} >
                {/* <ProfileUser /> */}
                <View style={{ flex: 2, height: "100%" }}>
                    <Link href={'../donwloadMapa'} style={styles.link}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 12 }}>
                            <AntDesign name="clouddownload" size={25} color={Colors.gray} />
                            <Text style={{ color: Colors.gray }}>Baixar mapa para usar offline</Text>
                        </View>
                    </Link>
                </View>
                <View style={{ flex: 1 }}>
                    <Pressable onPress={handleLogout} style={styles.logout}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: 12 }}>
                            <AntDesign name="logout" size={25} color={'white'} />
                            <Text style={{ color: 'white' }}>Logout</Text>
                        </View>
                    </Pressable>
                </View>

            </ScrollView>
        </SafeStatusBar>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 20,
        marginRight: 8,
        marginLeft: 8
    },
    link: {
        // w-full bg-white py-3 my-5 px-2 rounded-lg
        width: "100%",
        backgroundColor: 'white',
        paddingBottom: 12,
        paddingTop: 12,
        marginBottom: 20,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 8

    },
    logout: {
        // w-full bg-white py-3 my-5 px-2 rounded-lg
        width: "100%",
        backgroundColor: Colors.gray,
        paddingBottom: 12,
        paddingTop: 12,
        marginBottom: 20,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 8

    }
})