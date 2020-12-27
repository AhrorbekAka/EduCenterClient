import axios from 'axios';


export const DOMAIN = "https://edu-centre.herokuapp.com";
// export const DOMAIN = "http://localhost:";


export function queryData(data) {
    let token = localStorage.getItem('EducationCenterToken');
    const path = data.path;
    const method = data.method;

    delete data.path;
    delete data.method;
    try {
        return axios({
        url: DOMAIN+ path,
        method: method,
        data: data,
        headers:{
            Authorization:"Bearer "+token
        }
    })} catch (e) {
        return {object: {}}
    }}

export function queryParam(param) {
    let token = localStorage.getItem('EducationCenterToken');
    const path = param.path;
    const method = param.method;

    delete param.path;
    delete param.method;

    try{return axios({
        url: DOMAIN+ path,
        method: method,
        params: param,
        headers:{
            Authorization:"Bearer "+token
        }
    })} catch (e){
        return {object: {}}
    }
}
