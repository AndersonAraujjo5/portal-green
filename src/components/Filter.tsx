import { View } from "moti";
import Search from "./Search";
import Filtro from "@/database/Filtro";
import { Modal, Pressable, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import FilterData from "./FilterData";

export default function Filter({ setData, setMsgErro, setFilter }: any) {
    const [visible, setVisible] = useState(false)
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

    const handleModal = () => setVisible(!visible)

    return <>
        <View style={{
            backgroundColor: Colors.green,
            borderWidth: 1,
            borderColor: Colors.green,
            zIndex: 50,
            paddingHorizontal: 16,
        }}>
            <View style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 28,
                backgroundColor: "white",
                borderRadius: 12,
                paddingVertical: 4,
                paddingHorizontal: 12
            }}>
                <Search setData={setData} filter={setFilter} />
                <TouchableOpacity 
                onPress={handleModal}>
                    <Entypo name="sound-mix" size={16} />
                </TouchableOpacity>
                {/* <FilterData setData={setData} filter={setFilter} /> */}
            </View>
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

                <FilterData setData={setData} filter={setFilter} />
            </View>
        }
        <Modal 
        animationType="slide"
        visible={visible}>
            <TouchableOpacity 
            onPress={handleModal}>
                <Text>Cancelar</Text>
            </TouchableOpacity>
        </Modal>
    </>
}