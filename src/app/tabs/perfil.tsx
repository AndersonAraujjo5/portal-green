import ProfileUser from "@/components/ProfileUser";
import LoginBD from "@/database/LoginBD";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";

export default function tabPerfilScreen() {
    const handleLogout = () => {
        LoginBD.delete();
        router.replace('/')
    }
    return (
        <ScrollView style={styles.container}>
            {/* <ProfileUser /> */}
            <Link href={'../donwloadMapa'} style={styles.link}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: "center",gap: 12}}>
                    <AntDesign name="clouddownload" size={25} />
                    <Text>Baixar mapa para usar offline</Text>
                </View>
            </Link>
            <View style={{flex: 1}}>
               <Button onPress={handleLogout} title={'logout'} /> 
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingBottom: 20,
        paddingTop: 20,
        marginRight: 8, 
        marginLeft: 8
    }, 
    link: {
        // w-full bg-white py-3 my-5 px-2 rounded-lg
        width:"100%",
        backgroundColor: 'white',
        paddingBottom: 12,
        paddingTop: 12,
        marginTop: 20,
        marginBottom: 20,
        paddingRight: 8,
        paddingLeft: 8,
        borderRadius: 8

    }
})