import {useEffect, useState} from 'react';
import Layout from "../components/layout";
import Link from "next/link";

export default function Home() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    return (
        <Layout loading={loading} home>
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
                <br/>
                <br/>
                <br/>
                <div className="row mt-5">
                    <div className="col-10 offset-1 col-md-4 offset-md-4">

                        <div className='bg-transparent card text-center'>
                            <div className="card-body p-2 p-md-3">
                                <Link href="/test">
                                    <a className='border border-primary px-3 py-2'>
                                        Test
                                    </a>
                                </Link>
                                <Link href="/login">
                                    <a className='border border-white text-white px-3 py-2'>
                                        Log In
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
