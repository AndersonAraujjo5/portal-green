import Colors from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { View } from "moti";
import { Dimensions, Text, ScrollView } from "react-native";
import { ClienteStatus } from "@/components/ButtonActions";


const { width } = Dimensions.get('window');

function LocationPin({ status, size = 40, ...rest }) {
    return (
        <>
            {
                status === ClienteStatus.UsuarioCriado &&
                <Entypo name="location-pin" size={size} color={'red'} {...rest} />
            }
            {
                (status === ClienteStatus.InstalacaoEmAndamento ||
                    status === ClienteStatus.TecnicoACaminho ||
                    status === ClienteStatus.TecnicoDesignado
                ) &&
                <Entypo name="location-pin" size={size} color={'orange'} {...rest} />
            }
            {
                (status === ClienteStatus.InstalacaoConcluida) &&
                <Entypo name="location-pin" size={size} color={'blue'} {...rest} />
            }
            {
                (status === ClienteStatus.ClienteDesistiu) &&
                <Entypo name="location-pin" size={size} color={'black'} {...rest} />
            }
            {
                (status === ClienteStatus.CarneEntregue) &&
                <Entypo name="location-pin" size={size} color={Colors.green} {...rest} />
            }
        </>
    )
}
export default function InfoMap() {

    return <>

            <View>
                <ScrollView horizontal={true}
            showsHorizontalScrollIndicator={false}>
                <View style={{
                    display: 'flex', flexWrap: "wrap",
                    flexDirection: "row", justifyContent: "space-between",
                    paddingHorizontal: 8, paddingVertical: 4
                }}>
                    <View style={{ width: (width / 3.5) - 8, alignItems: "center" }}>
                        <LocationPin styles={{ textAlign: "center" }} size={20} status={ClienteStatus.UsuarioCriado} />
                        <Text>Aguardando</Text>
                        <Text>Instalação</Text>
                    </View>
                    <View style={{ width: (width / 3.5) - 8, alignItems: "center" }}>
                        <LocationPin styles={{}} size={20} status={ClienteStatus.TecnicoACaminho} />
                        <Text>Em</Text>
                        <Text>Andamento</Text>
                    </View>
                    <View style={{ width: (width / 3.5) - 8, alignItems: "center" }}>
                        <LocationPin styles={{}} size={20} status={ClienteStatus.InstalacaoConcluida} />
                        <Text>Instalação</Text>
                        <Text>Finalizada</Text>
                    </View>
                    <View style={{ width: (width / 3.5) - 8, alignItems: "center" }}>
                        <LocationPin styles={{}} size={20} status={ClienteStatus.ClienteDesistiu} />
                        <Text>Cancelado</Text>
                    </View>
    
                    <View style={{ width: (width / 3.5) - 8, alignItems: "center" }}>
                        <LocationPin styles={{}} size={20} status={ClienteStatus.CarneEntregue} />
                        <Text>Aguardando</Text>
                        <Text>Carnê</Text>
                    </View>
                </View>
            </ScrollView>
            </View>
    </>
}