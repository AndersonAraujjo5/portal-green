import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Comentar from "@/components/Comentar";
import CadastroBD from "@/database/CadastroBD";
import LoginBD from "@/database/LoginBD";
import { useState } from "react";
import { ScrollView } from "moti";

// { status: "Cadastro Pendente", color: 'bg-warning-subtle' },
// { status: "Usuário Criado", color: 'bg-success-subtle' },
// { status: "Técnico Designado", color: 'bg-dark-subtle' },
// { status: "Técnico a Caminho", color: 'bg-dark-subtle' },
// { status: "Instalação em Andamento", color: 'bg-dark-subtle' },
// { status: "Instalação Concluída", color:'bg-primary-subtle' },
// { status: "Cliente Desistiu",  color: 'bg-danger-subtle' }
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
    update: any
}

export default function ButtonAction({ cordenadas, status, id, update, tecnico }: ButtonAction) {
    const [statusValue, setStatusValue] = useState<string>(status)

    const atualizar = () => update(item => item + 1)

    const atualizarStatus = (status: string) => {
        const cadastros = CadastroBD.getAllCadastros();
        setStatusValue(status)
        if (cadastros) {
            cadastros.map(item => {
                if (item.id == id) {
                    item.status = status
                    CadastroBD.addStatus({
                        clienteId: id,
                        status: status,
                        tecnico: LoginBD.find()?.usuario.nome
                    })
                }
            })
        }
        CadastroBD.addAll(cadastros)

        CadastroBD.synchronize();

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

    console.log(tecnico)
    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View className="flex-row my-3 px-4">
                <Link className="bg-blue-400 px-4 py-3 rounded-full flex-row items-center gap-2"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${cordenadas.split(',')[1]},${cordenadas.split(',')[0]}`}>
                    <FontAwesome name="location-arrow" size={15} color="black" />
                    <Text> Rotas</Text>
                </Link>
                {
                    statusValue === ClienteStatus.UsuarioCriado &&
                    <Pressable className="border-2 mx-3 px-4 py-3 bg-red-400 rounded-full"
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
                            className="border-2 mx-3 px-4 py-3 rounded-full">
                            <Text >Finalizar</Text>
                        </Pressable>
                        <Pressable
                            onPress={cancelar}
                            className="border-2 mx-3 px-4 py-3 rounded-full">
                            <Text>Cencelar</Text>
                        </Pressable>
                    </>
                }

                <Comentar update={update} id={id} />

            </View>
        </ScrollView>
    )
}