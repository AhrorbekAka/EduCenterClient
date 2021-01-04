import axios from 'axios'
import {useRouter} from "next/router";
import {useState} from 'react';
import {DOMAIN, queryData} from "../services/requestService";
import Image from "next/image";

export default function Home() {

    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState({})

    const changeHandler = (e) => {
        payload[e.target.name] = e.target.value
    }

    const router = useRouter();

    const login = async () => {
        setLoading(true)
        await axios.post(DOMAIN + '/api/auth/login', payload).then(async (res) => {
                if (res.data.statusCodeValue === 200) {
                    localStorage.setItem("EducationCenterToken", res.data.body.accessToken);
                    queryData({path: "/api/menu", method: 'get'}).then(res => {
                        localStorage.setItem("menu", res.data.object.length)
                        if (res.data.object.length > 1) {
                            router.push("/students")
                        } else {
                            router.push("/groups")
                        }
                    })
                } else {
                    setPayload({})
                }
            }
        )
        setLoading(false)
    }

    if (loading) return (<div className='position-relative vh-100 vw-100 text-center'>
        <div
            className='position-absolute w-75 rounded px-0 py-2 p-md-5'
            style={{zIndex: '3', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Image
                src="/button-loading.gif"
                alt="loading..."
                width={45}
                height={45}/>
                <br/>
                <br/>
                Loading . . .
            {/*Oka biroz kutib turasiz endi, shundo serverga borib kevomman . . .*/}
        </div>
    </div>)
    else return (
        <div style={{backgroundImage: `url('./login-bg.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', overflow: 'hidden'}}>
            {/*<Layout home>*/}
            <br/>
            <br/>
            <br/>
            <br/>
            <div className="row mt-5">
                <div className="col-10 offset-1 col-md-4 offset-md-4">

                    <div className='card bg-transparent text-center'>
                        <h3 className='card-header text-monospace text-info'>Log In</h3>
                        <div className="card-body p-2 p-md-3">
                            <input className='form-control form-group mt-2 text-center text-info'
                                   onChange={(event) => changeHandler(event)}
                                   value={payload.phoneNumber} type="text"
                                   placeholder='Login'
                                   name="phoneNumber"/>
                            <input className='form-control form-group text-center text-danger'
                                   onChange={(event) => changeHandler(event)}
                                   value={payload.password}
                                   placeholder='Password'
                                   type="password"
                                   name="password"/>

                            <button onClick={login} className='btn btn-primary bg-transparent form-group text-monospace'>Log In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
