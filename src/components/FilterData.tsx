import Colors from "@/constants/Colors";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

type FilterDataProps = {
        setDataIni: any
        setDataFin:any
        dataIni: string
        dataFin: string
}

const { width, height } = Dimensions.get("window")

export default function FilterData({setDataIni, setDataFin,
    dataIni, dataFin}: FilterDataProps) {
    

    return (
        <>


                <View style={styles.modal}>
                    <View>
                    <Text style={{width: "40%"}}>Filtro por Data:</Text>
                        
                        <View style={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "row",
                            margin: "auto",
                            alignItems: "center",
                            justifyContent:"space-between"
                        }}>
                                <Text>Inicial:  </Text>

                            <View style={{
                                flexDirection: "column",
                                width: "40%",
                            }}>
                                <MaskInput
                                    mask={Masks.DATE_DDMMYYYY}
                                    style={styles.inputDate}
                                    value={dataIni}
                                    onChangeText={(value) => setDataIni(value)} />
                            </View>
                            <Text>Final:  </Text>

                            <View style={{
                                width: "40%"
                            }}>
                                <MaskInput
                                    mask={Masks.DATE_DDMMYYYY}
                                    style={styles.inputDate}
                                    value={dataFin}
                                    onChangeText={(value) => setDataFin(value)} />
                            </View>
                       </View>
                    </View>

                </View>
     
        </>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(156, 163, 175,0.5)',
        top: 0,
        right: 0,
        width,
        height,
        zIndex: 20
    },
    modal: {
        right: 0,
        width,
        paddingHorizontal: 12,
        paddingVertical:18,
        zIndex: 30,
        height: 80,
    },
    inputDate: {
        width: "100%",
        borderColor: Colors.gray,
        padding: 4,
        fontSize:22
    },
    btnPresquisar: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors.green,
    }
})