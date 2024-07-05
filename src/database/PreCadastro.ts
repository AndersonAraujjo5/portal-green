import { ICadastro, ClienteProps } from "@/interface/ICadastro";
import { api } from "@/service/api";
import { MMKV } from "react-native-mmkv";
import Cliente from "@/database/Cliente";
import { ClienteStatus } from "@/components/ButtonActions";

export default new class PreCadastro implements ICadastro {
    private _storage

    constructor() {
        this._storage = new MMKV();
    }

    add(cadastro: { id: number, nome: string; nomePai?: string; nomeMae?: string; cpf: string; rg?: string; dataNascimento?: string; email: string; telefone: string; cep?: string; cidade: string; endereco: string; bairro: string; numero: string; complemento?: string; plano: string; vencimento: string; info?: string; cordenadas: string; fotos?: string[]; }): boolean {
        if (typeof cadastro !== 'object') return false
        const cadastros = this._storage.getString('pre-cadastro')
        let cadastrosArray: ClienteProps[] = [];

        Cliente.add(cadastro);

        if (cadastros) {
            cadastrosArray = JSON.parse(cadastros);
        }

        cadastro.id = cadastrosArray.length !== 0 ? cadastrosArray.length : 0
        cadastrosArray.push(cadastro)

        console.log(cadastrosArray)

        this._storage.set('pre-cadastro', JSON.stringify(cadastrosArray));

        this.asyncEnviar();

        return true;
    }

    asyncEnviar() {
        const cadastros = this.findAll();

        if (cadastros) {
            const dados = cadastros;

            try {
                dados.map(async (item: ClienteProps, index: number) => {
                    item.status = ClienteStatus.CadastroEnviado;
                    const arr = ["nome", "nomePai", "nomeMae", "cpf", "rg", "dataNascimento", "email",
                        "telefone", "cep", "cidade", "endereco", "bairro", "numero", "complemento", "vencimento",
                        'cordenadas', 'fidelidade', 'info', 'status', 'plano']

                    const formData = new FormData()
                    arr.map((e: string) => {
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


                    api.post('/v1/cliente', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => this.deleteByIndex(index))
                    .catch(e=> e)

                })
            } catch (error) {
                console.log("errors", error)
                return error;
            }
        }
    }

    findAll(): ClienteProps[] | undefined {
        const cadastros = this._storage.getString('pre-cadastro');

        if (cadastros) {
            const dados = JSON.parse(cadastros)
            if (dados.length === 0) return;
            return dados;
        }
        return;
    }

    findById(id: number): object | undefined {
        if (!id) return;
        const cadastrados = this._storage.getString('pre-cadastro')

        if (cadastrados) {
            const cadastrosArray = JSON.parse(cadastrados)

            const cadastro = cadastrosArray.find(item => item.id === id)

            return cadastro
        }
        return;
    }

    deleteByIndex(index: number): boolean {
        if (typeof index !== 'number') throw new Error("Valor deve ser do tipo number");

        const cadastros = this._storage.getString('pre-cadastro');

        if (cadastros) {

            const cadastrosArray = JSON.parse(cadastros);

            cadastrosArray.shift(index, 1);

            this._storage.set('pre-cadastro', JSON.stringify(cadastrosArray));

            return true;
        }
        return false;
    }

    deleteById(id: number): boolean {
        if (typeof id !== 'number') throw new Error("Valor deve ser do tipo number");

        const cadastros = this._storage.getString('pre-cadastro');

        if (cadastros) {

            const cadastrosArray = JSON.parse(cadastros);

            let index = -1;

            cadastrosArray.find((item: ClienteProps, i: number) => {
                if (item.id === id) index = i;
            })

            if (index !== -1) cadastrosArray.shift(index, 1);

            this._storage.set('pre-cadastro', JSON.stringify(cadastrosArray));

            return true;
        }
        return false;
    }

    private addAndRewrite(cadastrado: ClienteProps)
        : ClienteProps | string {
        this._storage.set('pre-cadastro', JSON.stringify(cadastrado));
        return JSON.stringify(cadastrado);
    }


}