import { api } from '@/service/api';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export type LoginProps = {
    token: string
    usuario: {
        id: string | number
        nome: string
        login: string
        permissao: string
        cargo: string
        empresa: string
    }
}

export default new class LoginBD {

  public add(data: object) {
    storage.getString('authlogin');

    storage.set('authlogin', JSON.stringify(data));
    return
  };

  public find(): LoginProps | undefined{
    // Recupera o array de cadastros
    const data = storage.getString('authlogin');
    if (data) {
      const dataArray = JSON.parse(data);
      return dataArray;
    }
    return;
  };

  public delete(){
    storage.delete('authlogin');
  }

}