import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Comentar from "@/components/Comentar";
import LoginBD from "@/database/LoginBD";
import { useState } from "react";
import { ScrollView } from "moti";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import Finalizar from "@/components/Finalizar";

export enum ClienteStatus {
    SincronizacaoPendente = "Sincronização Pendente",
    CadastroPendente = "Cadastro Pendente",
    CadastroEnviado = "Cadastro Enviado",
    UsuarioCriado = "Usuário Criado",
    TecnicoDesignado = "Técnico Designado",
    TecnicoACaminho = "Técnico a Caminho",
    InstalacaoEmAndamento = "Instalação em Andamento",
    InstalacaoConcluida = "Instalação Concluída",
    ClienteDesistiu = "Cliente Desistiu",
    Cancelado = "Cancelado",
    CarneEntregue = "Carnê Entregue"
}

type ButtonAction = {
    cordenadas: number[]
    status: string
    id: number
    tecnico: string
    update?: any,
    fatura: string
}

export default function ButtonAction({ cordenadas, status, id, update, fatura, tecnico }: ButtonAction) {
    const [statusValue, setStatusValue] = useState<string>(status)
    const cargo = LoginBD.find()?.usuario.cargo
    const atualizar = () => update && update(item => item + 1)
    const atualizarStatus = (status: string) => {
        setStatusValue(status)
        Cliente.addStatus(id, {
            clienteId: id,
            status: status
        })

        atualizar();
    }
    const iniciar = () => {
        atualizarStatus(ClienteStatus.InstalacaoEmAndamento);
    }

    const finalizar = () => {
        atualizarStatus(ClienteStatus.InstalacaoConcluida)
    }


    const CarneEntregue = () => {
        atualizarStatus(ClienteStatus.CarneEntregue)
    }

    const cancelar = () => {
        atualizarStatus(ClienteStatus.Cancelado)
    }

    const desistiu = () => {
        atualizarStatus(ClienteStatus.ClienteDesistiu)
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                <Link style={styles.buttonRotas}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cordenadas.split(',')[1]},${cordenadas.split(',')[0]}`}>
                    <FontAwesome name="location-arrow" size={15} color="white" />
                    <Text style={{color: 'white'}}>  Rotas</Text>
                </Link>
                {
                    (statusValue == ClienteStatus.UsuarioCriado && cargo === "Tecnico") &&
                    <Pressable style={styles.buttons}
                        onPress={iniciar}>
                        <Text>iniciar atendimento</Text>
                    </Pressable>
                }
                {
                    (
                        cargo === "Tecnico" && (statusValue === ClienteStatus.TecnicoDesignado ||
                            statusValue === ClienteStatus.TecnicoACaminho ||
                            statusValue === ClienteStatus.InstalacaoEmAndamento
                        )
                       
                    ) &&
                    <>
                        <Finalizar id={id} update={update} />
                        <Pressable
                            onPress={cancelar}
                            style={styles.buttons}>
                            <Text>Cencelar</Text>
                        </Pressable>
                        <Pressable
                            onPress={desistiu}
                            style={styles.buttons}>
                            <Text>Cliente desistiu</Text>
                        </Pressable>
                    </>
                }
                <Comentar update={update} id={id} />

                {
                    (statusValue == ClienteStatus.InstalacaoConcluida &&
                        statusValue != ClienteStatus.CarneEntregue && fatura === "Carnê"
                    ) &&
                    <Pressable style={styles.buttons}
                        onPress={CarneEntregue}>
                        <Text>Carnê entregue</Text>
                    </Pressable>
                }

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'row',
        width:'100%'
    },

    buttonRotas:{
        backgroundColor: Colors.green,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 9999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttons:{
        borderWidth: 1,
        marginRight: 12,
        marginLeft: 12,
        paddingRight:12,
        paddingLeft: 12,
        borderRadius: 9999,
        justifyContent: 'center',
    }
})