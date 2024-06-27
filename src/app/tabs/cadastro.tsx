import MakerPoint from "@/components/MakerPoint";
import Camera from "@/components/Camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
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
import { api } from "@/service/api";
import { Masks } from "react-native-mask-input";
import { router } from "expo-router";

const validarCPF = (cpf: string) => {
  if (cpf.length > 14) return true;
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

type FormData1 = {
  nome: string
  nomePai: string
  nomeMae: string
  cpf: string
  rg: string
  dataNascimento: string
  email: string
  telefone: string
  cep: string
  cidade: string
  endereco: string
  bairro: string
  numero: string
  complemento: string
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
  numero: yup.string().required("Informe o numero da casa"),
  cidade: yup.string().required("Informe a cidade"),
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
  const [checkPlanAndVenci, setCheckPlanAndVenci] = useState()
  const [refreshing, setRefreshing] = useState(false);
  const [plano, setPlano] = useState();
  const [checkFidelidade, setCheckFidelidade] = useState(true)
  const [camera, setCamera] = useState(false)
  const [info, setInfo] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [cordenadas, setCordenadas] = useState(null);
  const [fotos, setFotos] = useState(null);
  const scrollViewRef = useRef(null)

  const inputs = {
    nome: useRef(null),
    nomePai: useRef(null),
    nomeMae: useRef(null),
    cpf: useRef(null),
    rg: useRef(null),
    dataNascimento: useRef(null),
    email: useRef(null),
    telefone: useRef(null),
    cep: useRef(null),
    cidade: useRef(null),
    endereco: useRef(null),
    bairro: useRef(null),
    numero: useRef(null),
    ref: useRef(null),
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData1>({
    resolver: yupResolver(schema)
  });
  const handleClosedCamera = () => {
    setCamera(false)
  }

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  useEffect(() => {
    scrollToTop();

    checkFormIsEmptyPlanAndVenci()
  }, [errors])



  const verificaFidelidade = () => {
    let fidelidade = '';
    if (checkFidelidade) fidelidade = "Sem fidelidade"
    else fidelidade = "Com fidelidade"
    return fidelidade;
  }

  const checkFormIsEmptyPlanAndVenci = () => {
    let errors: any = {}
    if (!plano) errors.planos = "Selecione um plano";
    if (!vencimento) errors.vencimento = "Selecione uma data de vencimento"

    setCheckPlanAndVenci(errors)
  }

  const handleSave = (data: FormData1) => {
    try {
      let obj: FormData2 = {};
      obj.plano = plano
      obj.fidelidade = verificaFidelidade();
      obj.info = info
      obj.vencimento = vencimento
      obj.cordenadas = cordenadas ? cordenadas.toString() : ''
      obj.foto = fotos ? fotos : ''
      obj.status = ClienteStatus.CadastroEnviado
      obj.localizacao = `https://www.google.com/maps?q=${cordenadas[0]},${cordenadas[1]}`
      const dados = { ...data, ...obj };

      NetInfo.fetch().then(async state => {
        try {
          if (state.isConnected) {
            const arr = ["nome", "nomePai", "nomeMae", "cpf", "rg", "dataNascimento", "email",
              "telefone", "cep", "cidade", "endereco", "bairro", "numero", "complemento", "vencimento",
              'cordenadas', 'fidelidade', 'info']

            const formData = new FormData()
            arr.map(e => {
              formData.append(e, dados[e]);
            })

            if (fotos) {
              fotos.map((e, i) => {
                formData.append('foto', {
                  uri: fotos[i].uri,
                  type: fotos[i].mimeType,
                  name: fotos[i].fileName
                })
              })
            }

            const data = await api.post('/v1/cliente', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            alert("Cadastro Enviado com sucesso")
            router.replace('/')

          } else {
            alert('sem internet')

            // Caso não tenha internet, salvar altomaticamente 
            // no dispositivo
            dados.status = ClienteStatus.SincronizacaoPendente
            CadastroBD.addPreCadastro(dados);
            alert("Cadastro Salva com sucesso")
            router.replace('/')
          }
        } catch (error) {
          console.log(error)
          dados.status = ClienteStatus.SincronizacaoPendente
          CadastroBD.addPreCadastro(dados);
          alert("Algo deu errado. Mas não se preocupe os dados foram salvos na memoria e serão enviado reenviado automaticamente...")
          router.replace('/')

        }
      })

    } catch (e) {
      console.log(e)
    }
  }

  const handleTrash = (index) => {
    setFotos(e => e.toSpliced(index, 1));
  }

  const onRefresh = () => {
    setCordenadas(null)
    setFotos(null)

    setRefreshing(true);
    reset();
    setRefreshing(false)
  }


  return (
    <View className="flex-1 pt-14 p-4">
      <StatusBar style='dark ' />
      {
        camera && <Camera closed={handleClosedCamera} setFotos={setFotos} />
      }

      {
        camera || <ScrollView ref={scrollViewRef}
          refreshControl={<RefreshControl refreshing={refreshing}
            onRefresh={onRefresh} />}>
          <Text className="font-bold text-2xl">
            Dados Pessoais
          </Text>
          <View>
            <ControllerInput inputRef={inputs.nome} onSubmitEditing={inputs.nomePai} control={control} label="Nome Completo" name="nome" error={errors.nome} />


            <View className="flex flex-row gap-2">
              <ControllerInput inputRef={inputs.nomePai} onSubmitEditing={inputs.nomeMae} className="flex-1" control={control} label="Nome do pai" name="nomePai" />
              <ControllerInput inputRef={inputs.nomeMae} onSubmitEditing={inputs.cpf} className="flex-1" control={control} label="Nome da Mae" name="nomeMae" />
            </View>

            <View className="flex flex-row gap-2">
              <ControllerInput inputRef={inputs.cpf} onSubmitEditing={inputs.rg} className="w-2/3 flex-1" mask={Masks.BRL_CPF_CNPJ} keyboardType="numeric" control={control} label="CPF" name="cpf" error={errors.cpf} />
              <ControllerInput inputRef={inputs.rg} onSubmitEditing={inputs.dataNascimento} className="w-1/3" keyboardType="numeric" control={control} label="RG" name="rg" />
            </View>

            <View className="flex ">
              <ControllerInput inputRef={inputs.dataNascimento} onSubmitEditing={inputs.email} className="flex-1" mask={Masks.DATE_DDMMYYYY} control={control} label="Data de nascimento" name="dataNascimento" />
            </View>

            <View className="flex flex-row gap-2">
              <ControllerInput inputRef={inputs.email} onSubmitEditing={inputs.telefone} className="flex-1" keyboardType="email-address" control={control} label="E-mail" name="email" error={errors.email} />
              <ControllerInput inputRef={inputs.telefone} onSubmitEditing={inputs.cep} className="flex-1" mask={Masks.BRL_PHONE} keyboardType="numeric" control={control} label="Telefone" name="telefone" />
            </View>

          </View>
          <Text className="font-bold text-2xl mt-5">
            Endereço
          </Text>

          <View className="flex flex-row gap-2">
            <ControllerInput inputRef={inputs.cep} onSubmitEditing={inputs.cidade} className="flex-1" mask={Masks.ZIP_CODE} keyboardType="numeric" control={control} label="CEP" name="cep" />
            <ControllerInput inputRef={inputs.cidade} onSubmitEditing={inputs.endereco} className="flex-1" control={control} label="Cidade" name="cidade" error={errors.cidade} />
          </View>

          <View className="flex flex-row gap-2">
            <ControllerInput inputRef={inputs.endereco} onSubmitEditing={inputs.bairro} className="w-2/3 flex-1" control={control} label="Endereco" name="endereco" error={errors.endereco} />
            <ControllerInput inputRef={inputs.bairro} onSubmitEditing={inputs.numero} className="w-1/3" control={control} label="Bairro" name="bairro" error={errors.bairro} />
          </View>
          <View className="flex flex-row gap-2">
            <ControllerInput inputRef={inputs.numero} onSubmitEditing={inputs.ref} className="w-1/3" keyboardType="numeric" control={control} label="Nº da casa" name="numero" error={errors.numero} />
            <ControllerInput inputRef={inputs.ref} className="w-2/3 flex-1" control={control} label="Ponto de Ref" name="complemento" />
          </View>
          <Text className="font-bold text-2xl mt-5">
            Plano Escolhido
          </Text>
          <View className="w-full my-5">
            <View className=" bg-gray-200 rounded-md ps-2">
              <Text className="text-gray-400">
                Planos
              </Text>
              <View className="w-full ">
                <RNPickerSelect
                  items={[
                    { label: "Ligth Green - 200MB", value: "Ligth Green - 200MB" },
                    { label: "Conexão Verde - 400MB", value: "Conexão Verde - 400MB" },
                    { label: "Mega Verde - 700MB", value: "Mega Verde - 700MB" },
                    { label: "Giga Verde - 1Gb", value: "Giga Verde - 1Gb" }
                  ]}
                  placeholder={{ label: "Selecione uma dos Planos", value: null }}
                  onValueChange={(value) => setPlano(value)}
                />
              </View>
            </View>
            {
              checkPlanAndVenci &&
              checkPlanAndVenci.planos &&
              <Text className="color-red-600 ps-2">{checkPlanAndVenci.planos}</Text>
            }
          </View>


          <View className="flex flex-row gap-2">
            <View className="w-1/2">
              <View className="flex justify-center items-center">
                <CheckBox
                  checked={!checkFidelidade}
                  onPress={() => setCheckFidelidade(!checkFidelidade)}
                  containerStyle={{
                    backgroundColor: "rgba(0,0,0,0)",
                  }} />
                  <Text>Com Fidelidade</Text>
              </View>
            </View>
            <View className="w-1/2">
              <View className="flex justify-center items-center">
                <CheckBox
                  checked={checkFidelidade}
                  onPress={() => setCheckFidelidade(!checkFidelidade)}
                  containerStyle={{
                    backgroundColor: "rgba(0,0,0,0)"
                  }} className="item-center" />
                <Text>Sem Fidelidade</Text>
              </View>
            </View>
          </View>

          <View className="w-full my-5  ">
            <View className="ps-2 bg-gray-200 rounded-md">
              <Text className="text-gray-400">
                Data do vencimento
              </Text>
              <View className="w-full m-0 p-0">
                <RNPickerSelect
                  items={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    { label: "15", value: "15" }
                  ]}
                  placeholder={{ label: "Selecione uma das opções", value: null }}
                  onValueChange={(value) => setVencimento(value)}
                />
              </View>
            </View>
            {
              checkPlanAndVenci &&
              checkPlanAndVenci.vencimento &&
              <Text className="color-red-600 ps-2">{checkPlanAndVenci.vencimento}</Text>
            }
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
            {
              cordenadas && <Text >Cordenadas: {cordenadas}</Text>
            }
            <View className="flex-row gap-2
             justify-around w-full ">
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

