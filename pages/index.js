import {useEffect, useState} from 'react';
import Layout from "../components/layout";
import Link from "next/link";
import LoginLayout from "../components/loginLayout";

export default function Home() {

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // setTimeout(() => {
        //     setLoading(false)
        // }, 1000)
        setLoading(false)
    }, [])

    return (
        <Layout loading={loading} home>
            <LoginLayout>
                <div className="row w-100 text-center align-self-center">
                    <div className='col-8 offset-3  col-md-4 offset-md-5'>
                        <Link href="/login">
                            <a className='btn btn-info text-white pb-0 w-100' style={{color: '#457b9d'}}>
                                <h5>Log In</h5>
                            </a>
                        </Link>
                    </div>
                    <br/>
                    <div className='mt-4 col-8 offset-3  col-md-4 offset-md-5'>
                        <Link href="/test">
                            <a className='btn btn-outline-info w-100 pb-0'>
                                <h5>Test topshirish</h5>
                            </a>
                        </Link>
                    </div>
                </div>
            </LoginLayout>
        </Layout>
    )
}
