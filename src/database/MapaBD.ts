import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();


export default new class MapaBD {
  public add(cadastro: string) {

    storage.getString('mapa');

    storage.set('mapa', JSON.stringify({type: cadastro}));
    return JSON.stringify(cadastro);
  };

  public find(){
    // Recupera o array de cadastros
    const cadastros = storage.getString('mapa');

    if (cadastros) {
      const cadastrosArray = JSON.parse(cadastros);
      return cadastrosArray;
    }

    return 'mapbox://styles/mapbox/streets-v11';
  };

}