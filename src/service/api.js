import LoginBD from "@/database/LoginBD";
import axios from "axios";
import { router } from "expo-router";
import DeviceInfo from 'react-native-device-info';

  const systemName = DeviceInfo.getSystemName(); // Nome do sistema operacional
  const systemVersion = DeviceInfo.getSystemVersion(); // Versão do sistema operacional
  const model = DeviceInfo.getModel(); // Modelo do dispositivo

  const userAgent = `portal-green/1.1 (${model}; ${systemName} ${systemVersion})`;


const api = axios.create({
    // baseURL:'https://fileprecadastro.greenet.net.br/api',
    // baseURL:'http://192.168.18.12:3007/api',
    baseURL:'http://10.129.0.228:3007/api',
    timeout: 1000, // 5 segundos
})

api.defaults.headers['User-Agent'] = userAgent

api.interceptors.response.use((response) => {
    return response;
},(error) => {
    // console.log(JSON.stringify(error),'\n\n\n', error.code)
    if(error.response && error.response.status === 404){
        return Promise.reject({errors:["Algo deu errado tente novamente mais tarde"]});
    }
    
    if(error.response && error.response.status === 401){
        LoginBD.delete();
        return router.replace('/')
    }
    
    if(error && error.code == 'ERR_NETWORK'){
        return Promise.reject({errors:[`Verifique a sua conexão com a internet ou tente novamente mais tarde`]});
    }

    // if(error.response === undefined && JSON.stringify(error).includes('Network Error')){
    //     return Promise.reject({errors:[`Ops, tente novamente mais tarde, ou entre em contato com o adminsitrator.`]});
    // }
    
    return Promise.reject(error.response);
})

if(LoginBD.find()){
    api.defaults.headers['Authorization'] = `Bearer ${LoginBD.find().token}`;
}


export {api}