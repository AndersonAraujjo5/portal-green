import MakerPoint from "@/components/MakerPoint";
import Camera from "@/components/Camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, Dimensions, FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import ControllerInput from "@/components/ControllerInput";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CadastroBD from "@/database/CadastroBD";
import MakerAtual from "@/components/MakerAtual";
import { AntDesign, Feather } from "@expo/vector-icons";
import { ClienteStatus } from "@/components/ButtonActions";
import NetInfo from "@react-native-community/netinfo";

const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
}

type FormData = {
  nome: string
  nomePai: string
  nomeMae: string
  cpf: string
  rg: string
  nascimento: string
  email: string
  telefone: string
  cep: string
  cidade: string
  endereco: string
  bairro: string
  casa: string
  ref: string
  velocidade: string
  tipo: string
  vencimento?: string
  info?: string
  cordenadas: string
  localizacao: string,
  fotos?: string[]
}

const schema = yup.object({
  nome: yup.string().required("Informe o nome do cliente"),
  cpf: yup.string().required("CPF e Obrigatorio").test('valid-cpf', 'CPF inválido', (value) => validarCPF(value)),
  email: yup.string().email("E-mail invalido"),
  endereco: yup.string().required("Informe o endereco"),
  bairro: yup.string().required("Informe o bairro"),
  casa: yup.string().required("Informe o numero da casa"),
  cidade: yup.string().required("Informe a cidade"),
  velocidade: yup.string().required("infome a velocidade")
})

type FormData2 = {
  plano?: string
  fidelidade?: string
  vencimento?: string
  info?: string
  localizacao?: string
  foto?: string[],
  cordenadas?: string[]
  status: string
}

export default function TabHomeScreen() {
  const { width } = Dimensions.get('window');
  const [refreshing, setRefreshing] = useState(false);
  const [checkPlano, setCheckPlano] = useState(true)
  const [checkFidelidade, setCheckFidelidade] = useState(true)
  const [camera, setCamera] = useState(false)
  const [info, setInfo] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [cordenadas, setCordenadas] = useState();
  const [fotos, setFotos] = useState();
  const[key, setKey] = useState(0)
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const handleClosedCamera = () => {
    setCamera(false)
  }

  const verificaPlanos = () => {
    let plano = '';
    if (checkPlano) plano = "Fibra"
    else plano = "Rádio"
    return plano;
  }

  const verificaFidelidade = () => {
    let fidelidade = '';
    if (checkFidelidade) fidelidade = "Com fidelidade"
    else fidelidade = "Sem fidelidade"
    return fidelidade;
  }



  const handleSave = (data: FormData) => {
    let obj: FormData2 = {};
    obj.plano = verificaPlanos();
    obj.fidelidade = verificaFidelidade();
    obj.info = info
    obj.vencimento = vencimento
    obj.cordenadas = cordenadas
    obj.foto = fotos;
    obj.status = ClienteStatus.CadastroEnviado
    obj.localizacao = `https://www.google.com/maps?q=${cordenadas[0]},${cordenadas[1]}`
    const dados = { ...data, ...obj };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // envia os dados para a api
        // caso de algum erro ao enviar os dados, tratar para salvar
        // as informações local
      } else {
        // Caso não tenha internet, salvar altomaticamente 
        // no dispositivo
       // CadastroBD.addCadastro(dados);
      }
    })
    CadastroBD.addCadastro(dados);

  }

  const handleTrash = (index) => {
    setFotos(e => e.toSpliced(index, 1));
  }

  const onRefresh = () => {
    setRefreshing(true);
    reset();
    setRefreshing(false)
  }


  return (
    <View className="flex-1 pt-14 p-4" key={key}>
      <StatusBar style='dark' />
      {
        camera && <Camera closed={handleClosedCamera} setFotos={setFotos} />
      }

      {
        camera || <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} 
        onRefresh={onRefresh}/>}>
          <Text className="font-bold text-2xl">
            Dados Pessoais
          </Text>
          <View>
            <ControllerInput control={control} label="Nome Completo" name="nome" error={errors.nome} />


            <View className="flex flex-row gap-2">
              <ControllerInput className="flex-1" control={control} label="Nome do pai" name="nomaPai" />
              <ControllerInput className="flex-1" control={control} label="Nome da Mae" name="nomeMae" />
            </View>

            <View className="flex flex-row gap-2">
              <ControllerInput className="w-2/3 flex-1" control={control} label="CPF" name="cpf" error={errors.cpf} />
              <ControllerInput className="w-1/3" control={control} label="RG" name="rg" />
            </View>

            <View className="flex ">
              <ControllerInput className="flex-1" control={control} label="Data de nascimento" name="dataNascimento" />
            </View>

            <View className="flex flex-row gap-2">
              <ControllerInput className="flex-1" control={control} label="E-mail" name="email" error={errors.email} />
              <ControllerInput className="flex-1" control={control} label="Telefone" name="telefone" />
            </View>

          </View>
          <Text className="font-bold text-2xl mt-5">
            Endereço
          </Text>

          <View className="flex flex-row gap-2">
            <ControllerInput className="flex-1" control={control} label="CEP" name="cep" />
            <ControllerInput className="flex-1" control={control} label="Cidade" name="cidade" error={errors.cidade} />
          </View>

          <View className="flex flex-row gap-2">
            <ControllerInput className="w-2/3 flex-1" control={control} label="Endereço" name="endereco" error={errors.endereco} />
            <ControllerInput className="w-1/3" control={control} label="Bairro" name="bairro" error={errors.bairro} />
          </View>
          <View className="flex flex-row gap-2">
            <ControllerInput className="w-1/3" control={control} label="Nº da casa" name="casa" error={errors.casa} />
            <ControllerInput className="w-2/3 flex-1" control={control} label="Ponto de Ref" name="ref" />
          </View>

          <Text className="font-bold text-2xl mt-5">
            Plano Escolhido
          </Text>
          <ControllerInput className="flex-1" control={control} label="Velocidade" name="velocidade" error={errors.velocidade} />

          <View className="flex flex-row gap-2">
            <View className="w-1/2">
              <CheckBox
                checked={checkPlano}
                onPress={() => setCheckPlano(!checkPlano)}
                containerStyle={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                title={"Fibra"} />
            </View>
            <View className="w-1/2">
              <CheckBox
                checked={!checkPlano}
                onPress={() => setCheckPlano(!checkPlano)}
                containerStyle={{
                  backgroundColor: "rgba(0,0,0,0)"
                }}
                title={"Rádio"} />
            </View>
          </View>

          <View className="flex flex-row gap-2">
            <View className="w-1/2">
              <CheckBox
                checked={checkFidelidade}
                onPress={() => setCheckFidelidade(!checkFidelidade)}
                containerStyle={{
                  backgroundColor: "rgba(0,0,0,0)",
                }}
                title={"Com Fidelidade"} />
            </View>
            <View className="w-1/2">
              <CheckBox
                checked={!checkFidelidade}
                onPress={() => setCheckFidelidade(!checkFidelidade)}
                containerStyle={{
                  backgroundColor: "rgba(0,0,0,0)"
                }}
                title={"Sem Fidelidade"} />
            </View>
          </View>

          <View className="w-full h-16 my-5 bg-gray-200 rounded-md ps-2">
            <Text className="text-gray-400">
              Data do vencimento
            </Text>
            <View className="w-full ">
              <RNPickerSelect
                items={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "15", value: "15" }
                ]}
                placeholder={{ label: "Selecione uma das opções", value: null }}
                onValueChange={(value) => setVencimento(value)}
                style={{}}
              />
            </View>
          </View>

          <View className="w-full flex-1">
            <View className="w-full bg-gray-200 rounded-md ps-2 mt-4">
              <Text className="text-gray-400">Mais informações</Text>
              <TextInput
                onChangeText={setInfo}
                multiline={true}
                numberOfLines={10}
                style={{ textAlignVertical: "top" }}
                className="flex-1 font-normal text-base text-gray-700 h-36 justify-start " />
            </View>
          </View>

          <View className="w-full my-10 flex items-center">
            <View className="flex-row gap-2
             justify-around w-full align-baseline">
              <MakerAtual setLocaction={setCordenadas} />
              <MakerPoint setLocation={setCordenadas} />

              <View className="w-1/3 auto p-1">
                <Pressable className="flex items-center justify-center w-full h-20 bg-gray-300 p-2 rounded-lg"
                  onPress={() => { setCamera(true) }}>
                  <Feather name="camera" size={20} color={"blue"} />
                  <Text>
                    Camera
                  </Text>
                </Pressable>

              </View>
            </View>
            <FlatList
              className="px-2 my-5"
              horizontal={true}
              data={fotos}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View className="relative">
                    <Pressable onLongPress={() => alert("isso")}>
                      <Image
                        className=" my-2 rounded-lg mx-2"
                        width={width / 2} height={200}
                        source={{ uri: item.uri }}
                        resizeMode="cover"
                      />
                    </Pressable>
                    <Pressable onPress={() => handleTrash(index)} className="right-5 top-5 absolute">
                      <AntDesign name="close" size={20} color={'white'} />
                    </Pressable>
                  </View>
                )
              }}
              keyExtractor={(item) => item.fileName}
            />
            <View className="w-1/3 mt-10">
              <Button onPress={handleSubmit(handleSave)} title="Enviar" />
            </View>
          </View>
        </ScrollView >
      }

    </View >
  )
}

