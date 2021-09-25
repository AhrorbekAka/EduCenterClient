import axios from 'axios'
import {useRouter} from "next/router";
import {useState, useEffect} from 'react';
import {DOMAIN, queryData} from "../services/requestService";
import Layout from "../components/layout";
import LoginLayout from "../components/loginLayout";

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
        ).catch(res=> {
            console.log(res)
            setLoading(false)
        })
    }

    return (
        <Layout home loading={loading}>
            <LoginLayout>
                <div className='align-self-center w-100 px-md-5 text-center'>
                    <h3 className='text-monospace text-info'>Log In</h3>
                    <div className="p-2 p-md-3">
                        <input className='form-control form-group mt-2 w-100 text-center text-info'
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
                                className='btn btn-info form-group text-monospace'>Log In
                        </button>
                    </div>
                </div>
            </LoginLayout>
        </Layout>
    )
}
