import { View } from "moti";
import Search from "./Search";
import Filtro from "@/database/Filtro";
import { Pressable, Text } from "react-native";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import FilterData from "./FilterData";

export default function Filter({setData, setMsgErro, setFilter}: any) {

    const deleteFilter = () => {
        Filtro.delete();
        Cliente.syncronize()
            .then(item => {
                if (item.length != 0) {
                    setData(item)
                    setMsgErro(null)
                }
                else {
                    setMsgErro(['Sem usuarios cadastrados'])
                    setData(null)
                }
            }).catch(e => {
                setData(Cliente.findAll());
            });
    }

    return <>
        <View style={{
            display: "flex",
            flexDirection: 'row',
            alignItems: "center"
        }}>
            <Search setData={setData} filter={setFilter} />
            <FilterData setData={setData} filter={setFilter} />
        </View>
        {
            Filtro.find().filter &&
            <View style={{
                padding: 8,
                display: 'flex',
                flexDirection: "row",
                justifyContent: "flex-end"
            }} >
                <Pressable style={{
                    backgroundColor: Colors.gray,
                    borderRadius: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 4
                }}
                    onPress={deleteFilter}>
                    <Text style={{ color: "white" }}>Limpar Filtro</Text>
                </Pressable>
            </View>
        }
    </>
}