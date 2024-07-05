import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Comentar from "@/components/Comentar";
import CadastroBD from "@/database/CadastroBD";
import LoginBD from "@/database/LoginBD";
import { useState } from "react";
import { ScrollView } from "moti";
import Colors from "@/constants/Colors";
import Cliente from "@/database/Cliente";

export enum ClienteStatus {
    SincronizacaoPendente = "Sincronização Pendente",
    CadastroPendente = "Cadastro Pendente",
    CadastroEnviado = "Cadastro Enviado",
    UsuarioCriado = "Usuário Criado",
    TecnicoDesignado = "Técnico Designado",
    TecnicoACaminho = "Técnico a Caminho",
    InstalacaoEmAndamento = "Instalação em Andamento",
    InstalacaoConcluida = "Instalação Concluída",
    ClienteDesistiu = "Cliente Desistiu"
}

type ButtonAction = {
    cordenadas: number[]
    status: string
    id: number
    tecnico: string
    update?: any
}

export default function ButtonAction({ cordenadas, status, id, update, tecnico }: ButtonAction) {
    const [statusValue, setStatusValue] = useState<string>(status)

    const atualizar = () => update && update(item => item + 1)
    console.log(update)
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

    const cancelar = () => {
        atualizarStatus(ClienteStatus.ClienteDesistiu)
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                <Link style={styles.buttonRotas}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cordenadas.split(',')[1]},${cordenadas.split(',')[0]}`}>
                    <FontAwesome name="location-arrow" size={15} color="black" />
                    <Text> Rotas</Text>
                </Link>
                {
                    statusValue == ClienteStatus.UsuarioCriado &&
                    <Pressable style={styles.buttons}
                        onPress={iniciar}>
                        <Text>iniciar atendimento</Text>
                    </Pressable>
                }
                {
                    (
                        (statusValue === ClienteStatus.TecnicoDesignado ||
                            statusValue === ClienteStatus.TecnicoACaminho ||
                            statusValue === ClienteStatus.InstalacaoEmAndamento
                        )
                        && tecnico === LoginBD.find()?.usuario.nome
                    ) &&
                    <>
                        <Pressable
                            onPress={finalizar}
                            style={styles.buttons}>
                            <Text >Finalizar</Text>
                        </Pressable>
                        <Pressable
                            onPress={cancelar}
                            style={styles.buttons}>
                            <Text>Cencelar</Text>
                        </Pressable>
                    </>
                }

                <Comentar update={update} id={id} />

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
        paddingRight: 16,
        paddingLeft:16,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 9999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
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