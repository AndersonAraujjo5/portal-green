import { View } from "moti";
import Search from "./Search";
import Filtro from "@/database/Filtro";
import { Modal, Pressable, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState } from "react";
import FilterData from "@/components/FilterData";
import { ClienteStatus } from "@/components/ButtonActions";
import RNPickerSelect from "react-native-picker-select";
import { api } from "@/service/api";


export default function Filter({ setData, setMsgErro, setFilter, msgError }: any) {
    const [visible, setVisible] = useState(false)
    const [dataIni, setDataIni] = useState('')
    const [dataFin, setDataFin] = useState('')
    const [isStatus, setIsStatus] = useState('')
    const [isPlano, setIsPlano] = useState('')


    const getDateAtual = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const formatDate = (date) => {
        if (!date) return getDateAtual();
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = date.match(datePattern);

        if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return getDateAtual();
    }

    const handlePesquisar = () => {
        const url = `/v1/cliente?size=100&${dataIni && `dataInicio=${formatDate(dataIni)}&`}${dataFin && `dataFim=${formatDate(dataFin)}&`}${isStatus && `status=${isStatus}&`}${isPlano && `plano=${isPlano}`}`
        console.log(dataIni,dataFin,isStatus, isPlano,'\n\n', url)
        api.get(url).
            then(({data}) => {
                setData(data.data)
                Cliente.addAndRewrite(data.data)
            }).catch(erro => {
                if(erro.errors) msgError(erro.errors)
                console.log("error", erro)
            })
        setFilter(true)
        setVisible(false)

        Filtro.add({ dataIni, dataFin, status: isStatus, plano: isPlano });
    }



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

    const status = [];
    
    for(let s in ClienteStatus){
        status.push({label:ClienteStatus[s], value:ClienteStatus[s]})
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
            </View>
        }
        <Modal 
        animationType="slide"
        visible={visible}>
            <TouchableOpacity 
            style={{marginVertical: 12, marginHorizontal: 8}}
            onPress={handleModal}>
                <AntDesign name="left" size={25} />          
            </TouchableOpacity>

            <View style={{paddingHorizontal: 12}} >
                <Text>Filtro por Status</Text>
                <View>
                <View style={{ width: "100%", padding: 0, margin: 0, borderWidth: 1,
                    borderRadius: 12,
                    marginTop: 8
                 }}>
                  <RNPickerSelect
                    items={status}
                    placeholder={{ label: "Selecione uma das opções", value: '' }}
                    onValueChange={(value) => {setIsStatus(value)}}
                  />
                </View>
                </View>
            </View>

            <View style={{paddingHorizontal: 12, marginTop: 18}} >
                <Text>Filtro por Planos</Text>
                <View>
                <View style={{ width: "100%", padding: 0, margin: 0, borderWidth: 1,
                    borderRadius: 12,
                    marginTop: 8
                 }}>
                  <RNPickerSelect
                    items={[
                        { label: "Ligth Green - 200MB", value: "Ligth Green - 200MB" },
                      { label: "Conexão Verde - 400MB", value: "Conexão Verde - 400MB" },
                      { label: "Mega Verde - 700MB", value: "Mega Verde - 700MB" },
                      { label: "Giga Verde - 1Gb", value: "Giga Verde - 1Gb" }
                    ]}
                    placeholder={{ label: "Selecione uma das opções", value: '' }}
                    onValueChange={(value) => {setIsPlano(value)}}
                  />
                </View>
                </View>
            </View>

            <FilterData setDataIni={setDataIni}
            setDataFin={setDataFin}
            dataIni={dataIni}
            dataFin={dataFin} />
            <TouchableOpacity style={{
                backgroundColor: Colors.green,
                width: '40%',
                paddingVertical: 8,
                borderRadius: 12,
                position: 'absolute', bottom: 40,right:22
            }}
            onPress={handlePesquisar}
            >
                <Text style={{textAlign:"center", color:"white"}}>Filtrar</Text>
            </TouchableOpacity>
        </Modal>
    </>
}
