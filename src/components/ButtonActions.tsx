import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

// { status: "Cadastro Pendente", color: 'bg-warning-subtle' },
// { status: "Usuário Criado", color: 'bg-success-subtle' },
// { status: "Técnico Designado", color: 'bg-dark-subtle' },
// { status: "Técnico a Caminho", color: 'bg-dark-subtle' },
// { status: "Instalação em Andamento", color: 'bg-dark-subtle' },
// { status: "Instalação Concluída", color:'bg-primary-subtle' },
// { status: "Cliente Desistiu",  color: 'bg-danger-subtle' }
export enum ClienteStatus {
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
}

export default function ButtonAction({ cordenadas, status }: ButtonAction) {
    return (
        <View className="flex-row my-3">
            <Link className="bg-blue-400 px-4 py-3 rounded-full flex-row items-center gap-2"
                href={`https://www.google.com/maps/dir/?api=1&destination=${cordenadas.split(',')[1]},${cordenadas.split(',')[0]}`}>
                <FontAwesome name="location-arrow" size={15} color="black" />
                <Text> Rotas</Text>
            </Link>
            {
                status === ClienteStatus.UsuarioCriado &&
                <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                    <Text>iniciar atendimento</Text>
                </Pressable>
            }
            {
                (status === ClienteStatus.TecnicoDesignado ||
                    status === ClienteStatus.TecnicoACaminho) &&
                <>
                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                        <Text>Pausar</Text>
                    </Pressable>
                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                        <Text>Cencelar</Text>
                    </Pressable>
                </>
            }

            {
                status === ClienteStatus.InstalacaoEmAndamento &&
                <>
                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                        <Text>Finalizar</Text>
                    </Pressable>
                    <Pressable className="border-2 mx-3 px-4 py-3 rounded-full">
                        <Text>Cencelar</Text>
                    </Pressable>
                </>
            }

        </View>
    )
}