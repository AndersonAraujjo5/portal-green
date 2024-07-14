import { ClienteProps, StatusProps } from "@/interface/ICadastro";
import { api } from "@/service/api";
import { MMKV } from "react-native-mmkv";
import LoginBD from "./LoginBD";


export default new class Status {
    private _storage

    constructor() {
        this._storage = new MMKV();
    }

    add(cadastro: StatusProps): boolean {
        if (typeof cadastro !== 'object') return false
        const cadastros = this.findAll()
        let cadastrosArray: StatusProps[] = [];
        if (cadastros) {
            cadastrosArray = cadastros;
        }

        cadastro.id = cadastrosArray.length !== 0 ? cadastrosArray.length : 0

        cadastrosArray.push(cadastro)

        this._storage.set('status', JSON.stringify(cadastrosArray));

        this.asyncEnviar();

        return true;
    }

     asyncEnviar() {
        const cadastros = this.findAll();
        if (cadastros) {
            const dados = cadastros;

            try {
                dados.map(async (item: StatusProps, index: number) => {
                  try {
                    await api.put(`/v1/cliente/${item.clienteId}`, { status: item.status,
                        tecnico: LoginBD.find()?.usuario.nome
                    })
                    
                    this.deleteById(index)

                    const formData = new FormData();
                    formData.append('status', item.status)

                    await api.post(`/v1/cliente/comentario/${item.clienteId}`, formData,{
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      })
                  } catch (error) {
                    console.log('error',error)
                  }
                })
            } catch (error) {
                console.log("errors", error)
            }
        }
    }

    findAll(): StatusProps[] | undefined {
        const cadastros = this._storage.getString('status');

        if (cadastros) {
            const dados = JSON.parse(cadastros)
            if (dados.length === 0) return;
            return dados;
        }
        return;
    }


    deleteById(id: number): boolean {
        if (typeof id !== 'number') throw new Error("Valor deve ser do tipo number");

        const cadastros = this._storage.getString('status');

        if (cadastros) {

            const cadastrosArray = JSON.parse(cadastros);

            let index = -1;

            cadastrosArray.find((item: ClienteProps, i: number) => {
                if (item.id === id) index = i;
            })

            if (index !== -1) cadastrosArray.shift(index, 1);

            this._storage.set('status', JSON.stringify(cadastrosArray));

            return true;
        }
        return false;
    }

}