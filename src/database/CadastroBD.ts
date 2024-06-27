import { api } from '@/service/api';
import Images from '@/utils/Images';
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

  public synchronize() {
    // enviar cadastros não sincronizados
    this.enviarPreCadastros();

    // pega os dados da api e salva local
    api.get('/v1/cliente').then(({ data }) => {
      this.addAll(data.data)

      // pega os dados da api
      data.data.map((item: any) => {
        if (item.Fotos.length !== 0) item.Fotos.map(({ url }: any) => {
          this.saveImageStorage(url); // salva as imagens no dispositivo
          Images.saveStorage(url);    // salva as url em uma lista
        })
      })
    }).catch(error => {
      console.log(error)
      console.log("Algo deu errado")
    })



    const urls = this.getAllImagesStorage(); // pega todas as url
    Images.cleanUpOldImages(urls) // deleta as iamgens que não estão na lista
  }

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

    cadastro.id = cadastrosArray.length == 0 ? 0 : cadastrosArray.length + 1

    // Adiciona o novo cadastro ao array
    cadastrosArray.push(cadastro);

    // Armazena o array atualizado no MMKV
    storage.set('pre-cadastros', JSON.stringify(cadastrosArray));
    return JSON.stringify(cadastrosArray);
  };

  public getCadastroByName() {
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

  public getAllCadastros() {
    // Recupera o array de cadastros
    const cadastros = storage.getString('cadastros');

    if (cadastros) {
      return JSON.parse(cadastros);
    }

    return [];
  };

  public getAllPreCadastros() {
    // Recupera o array de cadastros
    const cadastros = storage.getString('pre-cadastros');

    if (cadastros) {
      return JSON.parse(cadastros);
    }

    return;
  };

  public enviarPreCadastros() { // Envia os dados que foram pre cadastrados offline
    // Recupera o array de cadastros
    const cadastros = storage.getString('pre-cadastros');
    if (cadastros) {
      const dados = JSON.parse(cadastros);
  
      try {
        dados.map(async (item, index) => {
          const arr = ["nome", "nomePai", "nomeMae", "cpf", "rg", "dataNascimento", "email",
            "telefone", "cep", "cidade", "endereco", "bairro", "numero", "complemento", "vencimento",
            'cordenadas', 'fidelidade', 'info']

          const formData = new FormData()
          arr.map(e => {
            if (!item[e]) return;
            formData.append(e, item[e]);
          })

          if (item.foto) {
            item.foto.map((e, i) => {
              formData.append('foto', {
                uri: item.foto[i].uri,
                type: item.foto[i].mimeType,
                name: item.foto[i].fileName
              })
            })
          }
          // verificar o porque as imagens não estão sendo enviadas
          try {
            await api.post('/v1/cliente', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })

            this.delete(index, 'pre-cadastros')
          } catch (e) {
            console.log('error', e)
          }

        })
      } catch (error) {
        console.log("errors", error)
      }
    }
  }

  public getFindById(id?: string | number, database = 'cadastros'): FormData {
    if (!id) return null;
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

  public findByExistCordenadas(): FormData {
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

  public delete(index: number, database: string) {
    const cadastros = storage.getString(database);
    if (cadastros) {
      const cadastrosArray = JSON.parse(cadastros);
      cadastrosArray.shift(index, 1);
      storage.set(database, JSON.stringify(cadastrosArray));
      return true;
    }
    return false;
  }

  public getAllImagesStorage(): string[] {
    // Recupera o array de cadastros
    const cadastros = storage.getString('image-storage');
    if (cadastros) {
      const data = JSON.parse(cadastros)
      return data[0].images;
    }
    return [];
  };


  public saveImageStorage(url: string) {
    // Recupera o array atual de cadastros
    const cadastros = storage.getString('image-storage');
    let cadastrosArray = [];

    if (!cadastros) {
      cadastrosArray.push({ images: [url] })
      storage.set('image-storage', JSON.stringify(cadastrosArray));
      //return JSON.stringify(cadastrosArray);
    }

    if (cadastros) {
      cadastrosArray = JSON.parse(cadastros);
    }

    // Adiciona o novo cadastro ao array
    cadastrosArray[0].images.push(url);

    // Armazena o array atualizado no MMKV
    storage.set('image-storage', JSON.stringify(cadastrosArray));
    // return JSON.stringify(cadastrosArray);
  };

  public deleteImageStorage(url: string) {
    const cadastros = storage.getString('image-storage');
    if (cadastros) {
      const cadastrosArray = JSON.parse(cadastros);
      const index = cadastrosArray[0].images.indexOf(url);
      if (index != -1)
        cadastrosArray[0].images.shift(index, 1);
      storage.set("image-storage", JSON.stringify(cadastrosArray));
    }
  }

}