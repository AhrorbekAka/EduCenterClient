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
            <br/>
            <div className="row mt-5">
                <div className="col-10 offset-1 col-md-4 offset-md-4">

                    <div className='card'>
                        <div className='card-header text-center text-success'>Log In</div>
                        <div className="card-body text-right p-1 p-md-3">
                            <input className='form-control form-group' onChange={(event) => changeHandler(event)}
                                   value={payload.phoneNumber} type="text"
                                   name="phoneNumber"/>
                            <input className='form-control form-group' onChange={(event) => changeHandler(event)}
                                   value={payload.password}
                                   type="password"
                                   name="password"/>

                            <button onClick={login} className='btn btn-primary form-group'>Log in</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
