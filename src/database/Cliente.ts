import { ICadastro, ClienteProps, ComentariosProps, StatusProps } from "@/interface/ICadastro";
import { api } from "@/service/api";
import Images from "@/utils/Images";
import { MMKV } from "react-native-mmkv";
import Comentario from "@/database/Comentario";
import Status from "@/database/Status";

export default new class Cliente implements ICadastro {
    private _storage

    constructor() {
        this._storage = new MMKV();
    }

    add(cadastro: ClienteProps): boolean {
        if (typeof cadastro !== 'object') return false
        const cadastros = this.findAll()
        let cadastrosArray: ClienteProps[] = [];

        if (cadastros) {
            cadastrosArray = cadastros;
        }

        cadastro.id = cadastrosArray.length !== 0 ? cadastrosArray.length : 0
        cadastrosArray.push(cadastro)

        this._storage.set('cadastros', JSON.stringify(cadastrosArray));

        return true;
    }

    addComentario(id: number, comentario: ComentariosProps) {
        if (!id) return;
        const cadastrados = this.findAll();
        
        Comentario.add(comentario)

        if (cadastrados) {
            const cadastrosArray = cadastrados;

            const cadastro = cadastrosArray.find((item: ClienteProps) => {
                if (item.id === id) {
                    item.Comentarios.push(comentario)
                    return item;
                }
            })

            this.deleteById(id);

            this.add(cadastro)

            return cadastro
        }
        return;
    }

    addStatus(id: number, status: StatusProps) {
        if (!id) return;
        const cadastrados = this.findAll();
        Status.add(status)
        
        if (cadastrados) {
            const cadastrosArray = cadastrados;

            const cadastro = cadastrosArray.find((item: ClienteProps) => {
                if (item.id === id) {
                    item.status = status.status
                    return item;
                }
            })
            this.deleteById(id);

            this.add(cadastro)

            return cadastro
        }
        return;
    }



    findAll(): ClienteProps[] | undefined {
        const cadastros = this._storage.getString('cadastros');

        if (cadastros) {
            const dados = JSON.parse(cadastros)
            if (dados.length === 0) return;
            return dados;
        }
        return;
    }

    findById(id: number): ClienteProps | undefined {
        if (!id) return;
        const cadastrados = this._storage.getString('cadastros')

        if (cadastrados) {
            const cadastrosArray = JSON.parse(cadastrados)

            const cadastro = cadastrosArray.find(item => item.id === id)

            return cadastro
        }
        return;
    }

    deleteById(id: number): boolean {
        if (typeof id !== 'number') throw new Error("Valor deve ser do tipo number");

        const cadastros = this._storage.getString('cadastros');

        if (cadastros) {

            const cadastrosArray = JSON.parse(cadastros);

            let index = -1;

            cadastrosArray.find((item: ClienteProps, i: number) => {
                if (item.id === id) index = i;
            })

            if (index !== -1) cadastrosArray.shift(id, 1);

            this._storage.set('cadastros', JSON.stringify(cadastrosArray));

            return true;
        }
        return false;
    }

    addAndRewrite(cadastrado: ClienteProps): ClienteProps {
        this._storage.set('cadastros', JSON.stringify(cadastrado));
        return JSON.stringify(cadastrado);
    }

    async syncronize() {
        const { data } = await api.get('/v1/cliente');

        this.addAndRewrite(data.data)
        data.data.map((item: ClienteProps) => {
            if (item.Fotos.length !== 0) item.Fotos.map(({ url }: any) => {
                this.saveImageStorage(url); // salva as imagens no dispositivo
                Images.saveStorage(url);    // salva as url em uma lista
            })

            if (item.Comentarios.length !== 0) item.Comentarios.map(({ url, type }) => {
                this.saveImageStorage(url); // salva as imagens no dispositivo
                Images.saveStorage(url);
            })
        })

        const urls = this.getAllImagesStorage();
        Images.cleanUpOldImages(urls)

        return data.data
    }

    getAllImagesStorage(): string[] {
        const cadastros = this._storage.getString('image-storage');
        if (cadastros) {
            const data = JSON.parse(cadastros)
            return data[0].images;
        }
        return [];
    };


    saveImageStorage(url: string) {
        const cadastros = this._storage.getString('image-storage');
        let cadastrosArray = [];

        if (!cadastros) {
            cadastrosArray.push({ images: [url] })
            this._storage.set('image-storage', JSON.stringify(cadastrosArray));
        }

        if (cadastros) {
            cadastrosArray = JSON.parse(cadastros);
        }

        cadastrosArray[0].images.push(url);

        this._storage.set('image-storage', JSON.stringify(cadastrosArray));
    }
}