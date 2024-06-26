import { api } from '@/service/api';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
export type FormData = {
  id: number
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
  info: string
  vencimento: string
  velocidade: string
  tipo: string
  cordenadas: number[] | string
  localizacao: string
}

export default new class CadastroBD {
  public addAll(cadastro: FormData) {
    storage.set('cadastros', JSON.stringify(cadastro));
    return JSON.stringify(cadastro);
  };

  public addPreCadastro(cadastro: FormData) {
    // Recupera o array atual de cadastros
    const cadastros = storage.getString('pre-cadastros');
    let cadastrosArray = [];

    if (cadastros) {
      cadastrosArray = JSON.parse(cadastros);
    }

    cadastro.id = cadastrosArray.length == 0 ? 0 : cadastrosArray.length+1

    // Adiciona o novo cadastro ao array
    cadastrosArray.push(cadastro);

    // Armazena o array atualizado no MMKV
    storage.set('pre-cadastros', JSON.stringify(cadastrosArray));
    return JSON.stringify(cadastrosArray);
  };

  public getCadastroByName(){
    // Recupera o array de cadastros
    const cadastros = storage.getString('cadastros');

    if (cadastros) {
      const cadastrosArray = JSON.parse(cadastros);

      // Encontra o cadastro pelo nome
      const cadastro = cadastrosArray.find(item => item.name === name);

      return cadastro;
    }

    return null;
  };

  public getAllCadastros(){
    // Recupera o array de cadastros
    const cadastros = storage.getString('cadastros');
  
    if (cadastros) {
      return JSON.parse(cadastros);
    }
  
    return [];
  };

  public getAllPreCadastros(){
    // Recupera o array de cadastros
    const cadastros = storage.getString('pre-cadastros');
  
    if (cadastros) {
      return JSON.parse(cadastros);
    }
  
    return;
  };

  public enviarPreCadastros(){ // Envia os dados que foram pre cadastrados offline
     // Recupera o array de cadastros
     const cadastros = storage.getString('pre-cadastros');
   //   this.deleteAll('pre-cadastros')
     if (cadastros) {
       const dados = JSON.parse(cadastros);
      console.log(dados)
      try {
        dados.map(async item => {
          const arr = ["nome", "nomePai", "nomeMae", "cpf", "rg", "dataNascimento", "email",
            "telefone", "cep", "cidade", "endereco", "bairro", "numero", "complemento", "vencimento",
            'cordenadas', 'fidelidade', 'info']
  
          const formData = new FormData()
          arr.map(e => {
            if(!item[e])return;
            formData.append(e, item[e]);
          })
  
          if (item.foto) {
            item.foto.map((e, i) => {
              console.log(e, item.nome)
              formData.append('foto', {
                uri: item.foto[i].uri,
                type: item.foto[i].mimeType,
                name: item.foto[i].fileName
              })
            })
          }
          // verificar o porque as imagens não estão sendo enviadas
          try{
            await api.post('/v1/cliente', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
          }catch(e){
            console.log('error',e)
            this.addPreCadastro(item)
          }
          
        })
      } catch (error) {
        console.log("errors",error)
      }
     }
  }

  public getFindById(id?:string | number, database = 'cadastros'): FormData{
    if(!id) return null;
     // Recupera o array de cadastros por id
     const cadastros = storage.getString(database);
     if (cadastros) {
       const cadastrosArray = JSON.parse(cadastros);
  
       // Encontra o cadastro pelo nome
       const cadastro = cadastrosArray.find(item => item.id == id);
       
       return cadastro;
     }
 
     return null;
  }

  public findByExistCordenadas(): FormData{
   
     // Recupera o array de cadastros por id
     const cadastros = storage.getString('cadastros');
     if (cadastros) {
       const cadastrosArray = JSON.parse(cadastros);
       // Encontra o cadastro pelo nome
       const cadastro = cadastrosArray.filter(item => item.cordenadas !== '' 
        && item.cordenadas !== null);
       
       return cadastro;
     }
     return null;
  }

  public deleteAll(database: string){
    storage.delete(database)
  }
}