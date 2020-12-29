import axios from 'axios'
import {useRouter} from "next/router";
import {useState} from 'react';
import {DOMAIN} from "../services/requestService";

export default function Home() {

    const [payload, setPayload] = useState({})
    const [loading, setLoading] = useState(false)

    const changeHandler = (e) => {
        payload[e.target.name] = e.target.value
    }

    const router = useRouter();

    const login = async () => {
        setLoading(true)
        const {data} = await axios.post(DOMAIN + '/api/auth/login', payload)
        if (data.statusCodeValue === 200) {
            await localStorage.setItem("EducationCenterToken", data.body.accessToken);
            await router.push("/groups")
        } else {
            setPayload({})
        }
        setLoading(false)
    }

    if(loading) return (<div className='position-relative vh-100 vw-100 text-center'>
        <div
            className='position-absolute bg-light w-75 rounded px-0 py-2 p-md-5'
            style={{zIndex: '3', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            Oka biroz kutib turasiz endi, shundo serverga borib kevomman . . .
        </div>
    </div>)
    else return (
        <>
            {/*<Layout home>*/}
            <br/>
            <div className="row mt-5">
                <div className="col-10 offset-1 col-md-4 offset-md-4">

                    <div className='card text-center'>
                        <div className='card-header text-success font-weight-bold'>Log In</div>
                        <div className="card-body p-2 p-md-3">
                            <input className='form-control form-group mt-2 text-center' onChange={(event) => changeHandler(event)}
                                   value={payload.phoneNumber} type="text"
                                   placeholder='Login'
                                   name="phoneNumber"/>
                            <input className='form-control form-group text-center' onChange={(event) => changeHandler(event)}
                                   value={payload.password}
                                   placeholder='Password'
                                   type="password"
                                   name="password"/>

                            <button onClick={login} className='btn btn-primary form-group text-monospace'>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
