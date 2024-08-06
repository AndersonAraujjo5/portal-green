import { FontAwesome } from "@expo/vector-icons";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Comentar from "@/components/Comentar";
import LoginBD from "@/database/LoginBD";
import { useState } from "react";
import { ScrollView } from "moti";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";
import Finalizar from "@/components/Finalizar";
import Cancelar from "@/components/Cancelar";

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

    const openMapApp = () => {
        const [longitude, latitude] = cordenadas.split(',');
        let url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;

        Linking.canOpenURL(url).then((supported: any) => {
            if (supported) {
                Linking.openURL(url)
            } else {
                console.log('No map app available');
            }
        }).catch(err => console.error('An error occurred', err));
    };


    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                <Pressable onPress={openMapApp} style={styles.buttonRotas}>
                    <FontAwesome name="location-arrow" size={15} color="white" />
                    <Text style={{ color: 'white' }}>  Rotas</Text>
                </Pressable>

                {
                    ((statusValue == ClienteStatus.UsuarioCriado && cargo === "Tecnico") && (tecnico == '' || tecnico === LoginBD.find()?.usuario.nome)) &&
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
                        <Finalizar handleFinalizar={finalizar} id={id} update={update} />
                        <Cancelar handle={cancelar} id={id} update={update} btnTitle="Cancelar" 
                        placeholder="Qual o motivo do cancelamento?" />
                        <Cancelar handle={desistiu} id={id} update={update} btnTitle="Cliente desistiu" 
                        placeholder="Qual o motivo da desistência do cliente?" />
                    </>
                }
                {
                    statusValue !== ClienteStatus.SincronizacaoPendente &&
                    <Comentar update={update} id={id} />
                }

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
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },

    buttonRotas: {
        backgroundColor: Colors.green,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 9999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttons: {
        borderWidth: 1,
        marginRight: 12,
        marginLeft: 12,
        paddingRight: 12,
        paddingLeft: 12,
        borderRadius: 9999,
        justifyContent: 'center',
    }
})