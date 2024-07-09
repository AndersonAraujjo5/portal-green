import { ICadastro, ComentariosProps } from "@/interface/ICadastro";
import { api } from "@/service/api";
import { MMKV } from "react-native-mmkv";

export default new class Comentario implements ICadastro {
    private _storage

    constructor() {
        this._storage = new MMKV();
    }

    add(cadastro: ComentariosProps): boolean {
        if (typeof cadastro !== 'object') return false
        try {
            const cadastros = this.findAll();
            let cadastrosArray: ComentariosProps[] = [];

            if (cadastros) {
                cadastrosArray = cadastros;
            }
            const index = cadastrosArray.length
       
            cadastro.id = cadastrosArray.length !== 0 ? cadastrosArray[index-1].id + 1 : 0

            cadastrosArray.push(cadastro)

            this._storage.set('comentarios', JSON.stringify(cadastrosArray));
            this.asyncEnviar();
        } catch (error) {
            console.log("wwwwww", error)
        }

        return true;
    }


    findAll(): ComentariosProps[] | undefined {
        const cadastros = this._storage.getString('comentarios');

        if (cadastros) {
            const dados = JSON.parse(cadastros)
            if (dados.length === 0) return;
            return dados;
        }
        return;
    }

    deleteById(id: number): boolean {
        if (typeof id !== 'number') throw new Error("Valor deve ser do tipo number");

        const cadastros = this.findAll();

        if (cadastros) {

            const cadastrosArray = cadastros;

            let index = -1;

            cadastrosArray.find((item: ComentariosProps, i: number) => {
                if (item.id === id) index = i;
            })

            if (index !== -1) cadastrosArray.shift(id, 1);

            this._storage.set('comentarios', JSON.stringify(cadastrosArray));

            return true;
        }
        return false;
    }

    asyncEnviar() {
        const cadastros = this.findAll()
        if (cadastros) {
            const dados = cadastros;

            try {
                dados.map(async (item: ComentariosProps, index: number) => {
                    try {
                        const formData = new FormData();
                        if (item.foto) {
                            formData.append('file', {
                                uri: item.foto,
                                type: `image/${item.foto.split('.').pop()}`,
                                name: item.foto.split('/').pop()
                            })

                        }

                        formData.append('body', item.body)

                        await api.post(`/v1/cliente/comentario/${item.clienteId}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        this.deleteById(item.id)

                    } catch (error) {
                        console.log("errors", error)
                    }
                })
            } catch (error) {
                console.log("errors", error)
            }
        }
    }
}