import axios from 'axios'
import {useRouter} from "next/router";
import {useState, useEffect} from 'react';
import {DOMAIN, queryData} from "../services/requestService";
import Layout from "../components/layout";

export default function Home() {

    const [loading, setLoading] = useState(true)
    const [payload, setPayload] = useState({})

    useEffect(() => setLoading(false), [])

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
                    setLoading(false)
                }
            }
        )
    }

    return (
        <Layout home loading={loading}>
            <div style={{
                backgroundImage: `url('./login-bg.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                overflow: 'hidden'
            }}>
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

                                <button onClick={login}
                                        className='btn btn-primary bg-transparent form-group text-monospace'>Log In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}