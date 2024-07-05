type StatusProps = {
    status: string
    tecnico?: string
    clienteId?: number
    id?: number
}


type ComentariosProps = {
    associado: string
    body: string
    clienteId: number
    createdAt: string
    id: number
    type: string
    url: string
    foto?: string
}

type FotosProps = {
    clienteId: number
    createdAt: string
    filename: string
    id: number
    url: string
}

type ClienteProps = {
    id: number
    nome: string
    nomePai?: string
    nomeMae?: string
    cpf: string
    rg?: string
    dataNascimento?: string
    email: string
    telefone: string
    cep?: string
    cidade: string
    endereco: string
    bairro: string
    numero: string
    status?: string
    complemento?: string
    plano: string
    vencimento: string
    info?: string
    cordenadas: string
    foto?: string[]
    Comentarios: ComentariosProps[]
    Fotos: FotosProps[]
}

interface ICadastro {
    add(cadastro: ClienteProps | ComentariosProps): boolean

    findById(id: number): object | undefined

    findAll(): object | undefined

    delete(id: number): boolean

    syncronize(): any
}

export { ICadastro, ClienteProps, ComentariosProps, StatusProps }