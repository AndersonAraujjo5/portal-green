import { Link } from "expo-router";
import { Dimensions, FlatList, Image, ScrollView } from "react-native";
import { Text, View } from "react-native";

export default function clienteInfor() {
    const { width } = Dimensions.get('window');
    const img = [
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"},
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"},
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"},
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"},
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"},
        {img:"https://greenet.net.br/assets/images/app-qualifica.webp"}
    ]
    return (
        <View>
            <View className="my-5 bg-white p-2">
                <Text className="text-2xl">Dados</Text>
                <View className="my-1">
                    <Text>Nome: Anderson Tailon</Text>
                </View>
                <View className="my-1">
                    <Text>Telefone: 91996031077</Text>
                </View>

                <View className="my-1">
                    <Text>Endereço: Tv. Quatorze de Março, 442 – Dom Joao VI Capanema – PA </Text>
                </View>
                <Link href={''} className="text-blue-600">
                    Ver no mapa
                </Link>
            </View>

            <View className="flex-1 flex-wrap gap-1 p-x-2 bg-white">
                <FlatList
                    data={ img }
                    renderItem={() => (
                        <View className="w-1/3 ">
                            <Image
                                className=""
                                width={width / 3} height={width / 3}
                                source={{ uri: 'https://greenet.net.br/assets/images/app-qualifica.webp' }}
                                resizeMode="cover" />
                        </View>
                    )}
                />
            </View>

        </View>
    )
}