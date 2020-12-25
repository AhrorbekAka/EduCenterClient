import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from "../components/layout";
import Link from "next/link";
import axios from 'axios'
import {useRouter} from "next/router";
import {useState} from 'react';
import {DOMAIN} from "../services/requestService";

export default function Home() {

    const [payload, setPayload] = useState({})

    const changeHandler = (e) => {
        payload[e.target.name] = e.target.value
    }

    const router = useRouter();

    const login = async () => {
        const {data} = await axios.post(DOMAIN + '/api/auth/login', payload)
        if (data.statusCodeValue === 200) {
            await localStorage.setItem("EducationCenterToken", data.body.accessToken);
            await router.push("/groups")
        }
    }

    return (
        <>
            {/*<Layout home>*/}
            <div className='card'>
                <input className='form-control' onChange={(event) => changeHandler(event)} value={payload.phoneNumber} type="text"
                       name="phoneNumber"/>
                <input className='form-control' onChange={(event) => changeHandler(event)} value={payload.password} type="password"
                       name="password"/>

                <button onClick={login} className='btn btn-primary'>Log in</button>
            </div>
        </>
    )
}
