import MakerPoint from "@/components/MakerPoint";
import Camera from "@/components/Camera";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import ControllerInput from "@/components/ControllerInput";
import { useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import MakerAtual from "@/components/MakerAtual";
import { AntDesign, Feather } from "@expo/vector-icons";
import { ClienteStatus } from "@/components/ButtonActions";
import { Masks } from "react-native-mask-input";
import { router } from "expo-router";
import Loader from "@/components/Loader";
import Colors from "@/constants/Colors";
import PreCadastro from "@/database/PreCadastro";
import SafeStatusBar from "@/components/SafeStatusBar";
import Comentario from "@/database/Comentario";
import Status from "@/database/Status";

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
  nome: yup.string().required("Informe o nome completo do proprietario").test('nome-sobrenome', 'Digite nome e sobrenome', (value) => {
    const nameParts = value.split(' ');
    return nameParts.length >= 2 && nameParts.every(part => part.trim().length > 0);
  }),
  nomeFantasia: yup.string().required("Informe o nome fantasia"),
  cpf: yup.string().required("CNPJ e Obrigatorio"),
  email: yup.string().email("E-mail invalido"),
  telefone: yup.string().required("Informe o numero de telefone").length(15, "Numero de telefone invalido"),
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

export default function juridico() {
  const { width } = Dimensions.get('window');
  const [checkPlanAndVenci, setCheckPlanAndVenci] = useState()
  const [refreshing, setRefreshing] = useState(false);
  const [plano, setPlano] = useState();
  const [checkFidelidade, setCheckFidelidade] = useState(true)
  const [checkCarne, setCheckCarne] = useState(true)
  const [camera, setCamera] = useState(false)
  const [info, setInfo] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [cordenadas, setCordenadas] = useState(null);
  const [fotos, setFotos] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
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

  const scrollToTop = (y = 0) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };

  if (Object.keys(errors).length != 0) {
    scrollToTop()
  }

  const verificaCarne = () => {
    let carne = '';
    if (checkCarne) carne = "E-mail/Whatsapp"
    else carne = "Carnê"
    return carne;
  }

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

    if (Object.keys(errors).length != 0) {
      scrollToTop(400)
      setCheckPlanAndVenci(errors)
      return false;
    }
    setCheckPlanAndVenci(errors)

    return true;
  }

  const checkCordenadas = () => {
    if (!cordenadas) {
      alert("Selecione a localização da casa do cliente")
      return false;
    }
    return true;
  }

  const handleSave = (data: FormData1) => {
    if (!checkFormIsEmptyPlanAndVenci()) return;
    if (!checkCordenadas()) return;
    setShowLoader(true);
    let obj: FormData2 = {};
    obj.plano = `${plano} - ${verificaFidelidade()}`
    obj.fatura = `${verificaCarne()}`
    obj.info = info
    obj.vencimento = vencimento
    obj.cordenadas = cordenadas ? cordenadas.toString() : ''
    obj.foto = fotos ? fotos : []
    obj.status = ClienteStatus.CadastroEnviado
    obj.localizacao = cordenadas ? `https://www.google.com/maps?q=${cordenadas[0]},${cordenadas[1]}` : ''
    const dados = { ...data, ...obj };
    dados.status = ClienteStatus.SincronizacaoPendente


    PreCadastro.add(dados)

    setShowLoader(false)
    alert("Salvo com sucesso")
    router.replace('/')
  }

  const handleTrash = (index) => {
    setFotos(e => e.toSpliced(index, 1));
  }

  const syncronize = () => {
    PreCadastro.asyncEnviar();
    Comentario.asyncEnviar()
    Status.asyncEnviar();
  }

  const onRefresh = () => {

    syncronize();
    setCordenadas(null)
    setFotos(null)

    setRefreshing(true);
    reset();
    setRefreshing(false)
  }

  return (
    <SafeStatusBar>
      <Loader show={showLoader} />
      <Modal 
        visible={camera} 
       onRequestClose={() => setCamera(false)}
       >
        <Camera closed={handleClosedCamera} setFotos={setFotos} />
      </Modal>

      <View style={{
        paddingLeft: 8,
        paddingRight: 8
      }}>
        {
          camera || <ScrollView ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing}
              onRefresh={onRefresh} />}>
            <Text style={styles.title}>
              Dados da Empresa
            </Text>
            <View>
              <ControllerInput inputRef={inputs.nome} onSubmitEditing={inputs.nomePai} control={control} label="Nome do proprietario*" name="nome" error={errors.nome} />

              <View style={styles.inputGroup}>
                <ControllerInput inputRef={inputs.nomePai} onSubmitEditing={inputs.nomeMae}
                  style={{ flex: 1 }}
                  control={control} label="Razão social" name="razaoSocial" />
                <ControllerInput inputRef={inputs.nomeMae} onSubmitEditing={inputs.cpf} style={{ flex: 1 }} control={control} label="Nome Fantasia*" name="nomeFantasia"error={errors.nomeFantasia}  />
              </View>

              <View style={styles.inputGroup}>
                <ControllerInput inputRef={inputs.cpf} onSubmitEditing={inputs.rg} style={{ width: "66.66%", flex: 1 }} mask={Masks.BRL_CNPJ} keyboardType="numeric" control={control} label="cnpj*" name="cpf" error={errors.cpf} />
                <ControllerInput inputRef={inputs.rg} onSubmitEditing={inputs.dataNascimento} style={{ width: '33.33%' }} keyboardType="numeric" control={control} label="RG" name="rg" />
              </View>


              <ControllerInput inputRef={inputs.dataNascimento} onSubmitEditing={inputs.email} keyboardType="numeric" style={{ flex: 1 }} mask={Masks.DATE_DDMMYYYY} control={control} label="Data de abertura" name="dataNascimento" />


              <View style={styles.inputGroup}>
                <ControllerInput inputRef={inputs.email} onSubmitEditing={inputs.telefone} style={{ flex: 1 }} keyboardType="email-address" control={control} label="E-mail" name="email" error={errors.email} />
                <ControllerInput inputRef={inputs.telefone} onSubmitEditing={inputs.cep} style={{ flex: 1 }} mask={Masks.BRL_PHONE} keyboardType="numeric" control={control} label="Telefone*" name="telefone" error={errors.telefone} />
              </View>

            </View>
            <Text style={styles.title}>
              Endereço
            </Text>

            <View style={styles.inputGroup}>
              <ControllerInput inputRef={inputs.cep} onSubmitEditing={inputs.cidade} style={{ flex: 1 }} mask={Masks.ZIP_CODE} keyboardType="numeric" control={control} label="CEP" name="cep" />
              <ControllerInput inputRef={inputs.cidade} onSubmitEditing={inputs.endereco} style={{ flex: 1 }} control={control} label="Cidade*" name="cidade" error={errors.cidade} />
            </View>

            <View style={styles.inputGroup}>
              <ControllerInput inputRef={inputs.endereco} onSubmitEditing={inputs.bairro} style={{ width: "66.66%", flex: 1 }} control={control} label="Endereco*" name="endereco" error={errors.endereco} />
              <ControllerInput inputRef={inputs.bairro} onSubmitEditing={inputs.numero} style={{ width: '33.33%' }} control={control} label="Bairro*" name="bairro" error={errors.bairro} />
            </View>
            <View style={styles.inputGroup}>
              <ControllerInput inputRef={inputs.numero} onSubmitEditing={inputs.ref} style={{ width: '33.33%' }} keyboardType="numeric" control={control} label="Nº da casa*" name="numero" error={errors.numero} />
              <ControllerInput inputRef={inputs.ref} style={{ width: "66.66%", flex: 1 }} control={control} label="Ponto de Ref" name="complemento" />
            </View>
            <Text style={styles.title}>
              Plano Escolhido
            </Text>
            <View style={styles.selectBox}>
              <View style={styles.containerSelect}>
                <Text style={{ color: Colors.gray }}>
                  Planos*
                </Text>
                <View style={{ width: '100%' }}>
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
                <Text style={{ color: '#dc2626', paddingRight: 8 }}>{checkPlanAndVenci.planos}</Text>
              }
            </View>

            <View style={{
              marginTop: 12, backgroundColor: 'rgba(156, 163, 175, 0.5)',
              paddingHorizontal: 8,
              paddingBottom: 8,
              borderRadius: 8
            }}>
              <Text style={{ color: Colors.gray }}></Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputBoxGroup}>
                  <View style={styles.inputCheckBox}>
                    <CheckBox
                      checked={!checkFidelidade}
                      onPress={() => setCheckFidelidade(!checkFidelidade)}
                      containerStyle={{
                        backgroundColor: "rgba(0,0,0,0)",
                        padding: 0
                      }} checkedColor={Colors.green}
                      uncheckedColor={Colors.gray} />
                    <Text style={{ color: Colors.gray }}>Com Fidelidade</Text>
                  </View>
                </View>
                <View style={styles.inputBoxGroup}>
                  <View style={styles.inputCheckBox}>
                    <CheckBox
                      checked={checkFidelidade}
                      onPress={() => setCheckFidelidade(!checkFidelidade)}
                      containerStyle={{
                        backgroundColor: "rgba(0,0,0,0)",
                        padding: 0
                      }} checkedColor={Colors.green}
                      uncheckedColor={Colors.gray} />
                    <Text style={{ color: Colors.gray }}>Sem Fidelidade</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.selectBox}>
              <View style={styles.containerSelect}>
                <Text style={{ color: Colors.gray }}>
                  Data do vencimento*
                </Text>
                <View style={{ width: "100%", padding: 0, margin: 0 }}>
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
                <Text style={{ color: '#dc2626', paddingRight: 8 }} >{checkPlanAndVenci.vencimento}</Text>
              }
            </View>

            <View style={{
              marginVertical: 12, backgroundColor: 'rgba(156, 163, 175, 0.5)',
              paddingHorizontal: 8,
              paddingBottom: 8,
              borderRadius: 8
            }}>
              <Text style={{ color: Colors.gray }}>Receber faturas por*</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputBoxGroup}>
                  <View style={styles.inputCheckBox}>
                    <CheckBox
                      checked={!checkCarne}
                      onPress={() => setCheckCarne(!checkCarne)}
                      containerStyle={{
                        backgroundColor: "rgba(0,0,0,0)",
                        padding: 0
                      }} checkedColor={Colors.green}
                      uncheckedColor={Colors.gray} />
                    <Text style={{ color: Colors.gray }}>Carnê</Text>
                  </View>
                </View>
                <View style={styles.inputBoxGroup}>
                  <View style={styles.inputCheckBox}>
                    <CheckBox
                      checked={checkCarne}
                      onPress={() => setCheckCarne(!checkCarne)}
                      containerStyle={{
                        backgroundColor: "rgba(0,0,0,0)",
                        padding: 0
                      }} checkedColor={Colors.green}
                      uncheckedColor={Colors.gray} />
                    <Text style={{ color: Colors.gray }}>E-mail/Whatsapp</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ width: "100%", flex: 1, marginTop: 12 }} >
              {/* className="w-full bg-gray-200 rounded-md ps-2 mt-4" */}
              <View style={styles.containerSelect} >
                <Text style={{ color: Colors.gray }}>Mais informações</Text>
                <TextInput
                  onChangeText={setInfo}
                  multiline={true}
                  numberOfLines={10}
                  style={styles.inputInfo}
                />
              </View>
            </View>

            <View style={styles.containerButton}>
              {
                cordenadas && <Text >Cordenadas: {cordenadas}</Text>
              }
              <View style={styles.buttonAction}>
                <MakerAtual setLocaction={setCordenadas} />
                <MakerPoint setLocation={setCordenadas} />

                <View style={{ width: '33.33%', padding: 4 }}>
                  <Pressable style={styles.buttonCamera}
                    onPress={() => { setCamera(true) }}>
                    <Feather name="camera" size={20} color={"white"} />
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      Camera
                    </Text>
                  </Pressable>

                </View>
              </View>
              <FlatList
                style={{
                  paddingLeft: 8,
                  paddingRight: 8,
                  marginTop: 20,
                  marginBottom: 20
                }}
                horizontal={true}
                data={fotos}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ position: 'relative' }}>
                      <Pressable onLongPress={() => alert("isso")}>
                        <Image
                          style={{
                            marginTop: 8,
                            marginBottom: 8,
                            marginLeft: 8,
                            marginRight: 8,
                            borderRadius: 8,
                          }}
                          width={width / 2} height={200}
                          source={{ uri: item.uri }}
                          resizeMode="cover"
                        />
                      </Pressable>
                      <Pressable onPress={() => handleTrash(index)}
                        style={{ right: 20, top: 20, position: 'absolute' }}>
                        <AntDesign name="close" size={20} color={'white'} />
                      </Pressable>
                    </View>
                  )
                }}
                keyExtractor={(item) => item.fileName}
              />
              <View style={{ width: '50%', marginTop: 40 }} >
                <Pressable style={{
                  padding: 8, borderRadius: 8,
                  backgroundColor: Colors.green
                }} onPress={handleSubmit(handleSave)}>
                  <Text style={{ textAlign: 'center', color: 'white' }}>Enviar</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView >
        }
      </View>

    </SafeStatusBar >
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32,
    marginTop: 16,
    marginBottom: 8
  },
  inputGroup: {
    // flex flex-row gap-2 w-full
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  inputBoxGroup: {
    width: "50%"
  },
  inputCheckBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  selectBox: {
    width: "100%",
    marginTop: 20,
  },
  containerSelect: {
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
    paddingLeft: 8,
    borderRadius: 6
  },
  containerButton: {
    width: '100%',
    display: 'flex',
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center'
  },
  buttonAction: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-around',
    width: '100%'
  },
  buttonCamera: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: 8,

    borderRadius: 8,
    backgroundColor: Colors.gray
  },
  inputInfo: {
    // flex-1 font-normal text-base text-gray-700 h-36 justify-start
    flex: 1,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    height: 144,
    justifyContent: 'flex-start',
    textAlignVertical: "top",
  }
})