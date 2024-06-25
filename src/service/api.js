import LoginBD from "@/database/LoginBD";
import axios from "axios";

export const api = axios.create({
    baseURL:'http://10.129.0.228:3002/api'
})

api.interceptors.response.use((response) => {
    return response;
},(error) => {
    if(error.response && error.response.status == 401){
        console.log("realize o login novamente")
    }

    return Promise.reject(error.response);
})

if(LoginBD.find()){
    api.defaults.headers['Authorization'] = `Bearer ${LoginBD.find().token}`;
}