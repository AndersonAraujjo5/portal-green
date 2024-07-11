import LoginBD from "@/database/LoginBD";
import axios from "axios";
import { router } from "expo-router";

const api = axios.create({
    baseURL:'http://10.129.0.156:3007/api',
    timeout: 5000, // 5 segundos
})

api.interceptors.response.use((response) => {
    return response;
},(error) => {
    if(error.response.status === 401){
        console.log("redirecionar")
        LoginBD.delete();
        router.replace('/')
    }

    if(error.response === undefined && JSON.stringify(error).includes('Network Error')){
        return Promise.reject({errors:[`Ops, tente novamente mais tarde, ou entre em contato com o adminsitrator.\nMas não se preocupe você pode realizar os cadastros normalmente`]});
    }
    
    return Promise.reject(error.response);
})

if(LoginBD.find()){
    api.defaults.headers['Authorization'] = `Bearer ${LoginBD.find().token}`;
}


export {api}