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

  public addCadastro(cadastro: FormData) {
    // Recupera o array atual de cadastros
    const cadastros = storage.getString('cadastros');
    let cadastrosArray = [];

    if (cadastros) {
      cadastrosArray = JSON.parse(cadastros);
    }

    cadastro.id = cadastrosArray.length == 0 ? 0 : cadastrosArray.length+1

    // Adiciona o novo cadastro ao array
    cadastrosArray.push(cadastro);

    // Armazena o array atualizado no MMKV
    storage.set('cadastros', JSON.stringify(cadastrosArray));
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

  public getFindById(id?:string | number): FormData{
    if(!id) return null;
     // Recupera o array de cadastros por id
     const cadastros = storage.getString('cadastros');
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
}