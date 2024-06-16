import { Text, View } from "react-native";

export default function ProfileUser() {
    return (
        <View className="w-full flex-row gap-4 items-center justify-around bg-white py-5 rounded-lg">
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
    )
}