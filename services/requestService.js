import axios from 'axios';


export const DOMAIN = "https://edu-centre.herokuapp.com";


export function queryData(data) {
    let token = localStorage.getItem('EducationCenterToken');
    const path = data.path;
    const method = data.method;

    delete data.path;
    delete data.method;
    return axios({
        url: DOMAIN+ path,
        method: method,
        data: data,
        headers:{
            Authorization:"Bearer "+token
        }
    })
}

export function queryParam(param) {
    let token = localStorage.getItem('EducationCenterToken');
    const path = param.path;
    const method = param.method;

    delete param.path;
    delete param.method;
    return axios({
        url: DOMAIN+ path,
        method: method,
        params: param,
        headers:{
            Authorization:"Bearer "+token
        }
    })
}
