import LoginBD from "@/database/LoginBD";
import axios from "axios";
import { router } from "expo-router";

const api = axios.create({
    baseURL:'https://fileprecadastro.greenet.net.br/api',
    // baseURL:'http://192.168.18.12:3007/api',
    // baseURL:'http://10.129.0.228:3007/api',
    timeout: 5000, // 5 segundos
})

api.interceptors.response.use((response) => {
    return response;
},(error) => {
    if(error.response && error.response.status === 404){
        return Promise.reject({errors:["Algo deu errado tente novamente mais tarde"]});
    }
    
    if(error.response && error.response.status === 401){
        LoginBD.delete();
        router.replace('/')
    }
    
    if(error.response && error.response.code === 'ERR_NETWORK'){
        return Promise.reject({errors:[`Verifique a sua conexão com a internet ou tente novamente mais tarde`]});
    }

    if(error.response === undefined && JSON.stringify(error).includes('Network Error')){
        return Promise.reject({errors:[`Ops, tente novamente mais tarde, ou entre em contato com o adminsitrator.`]});
    }
    
    return Promise.reject(error.response);
})

if(LoginBD.find()){
    api.defaults.headers['Authorization'] = `Bearer ${LoginBD.find().token}`;
}


export {api}