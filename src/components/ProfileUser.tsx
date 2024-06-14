import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function ProfileUser() {
    return (
        <View className="w-full flex-row gap-4 items-center">
            <View className="flex justify-center items-center py-4">
                <AntDesign className="p-3 rounded-full border-2" name="user" size={40} />
                <Text className="w-full">Anderson Araujo</Text>
            </View>
            <View className="flex-row gap-4 mb-5">
                <View className="items-center">
                    <Text className="text-2xl">90</Text>
                    <Text className="text-sm">Cadastrado</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl">90</Text>
                    <Text className="text-sm">cancelado</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl">90</Text>
                    <Text className="text-sm">finalizado</Text>
                </View>
            </View>
        </View>
    )
}