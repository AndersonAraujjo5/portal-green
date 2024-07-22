import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

type FilterProps = {
  filter: boolean
  dataIni: string
  dataFin: string
  staus: string
  plano: string
}

export default new class Filtro {

  public add(data: object) {
    storage.getString('filter');

    storage.set('filter', JSON.stringify({ filter: true, ...data }));
    return
  };

  public find(): FilterProps {
    // Recupera o array de cadastros
    const data = storage.getString('filter');
    if (data) {
      const dataArray = JSON.parse(data);
      return dataArray;
    }
    return {filter: false, dataFin: '', dataIni:'', staus: '', plano: ''};
  };

  public delete() {
    storage.delete('filter');
  }

}