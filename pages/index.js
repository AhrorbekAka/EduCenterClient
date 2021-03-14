import {useEffect, useState} from 'react';
import Layout from "../components/layout";
import Link from "next/link";

export default function Home() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }, [])

    return (
        <Layout loading={loading} home>
            <div style={{
                backgroundImage: `url('./login-bg.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div>
                        <div className="card-body p-2 p-md-3">
                            <div style={{borderBottom: '6px solid LemonChiffon'}} className=' py-2 mb-5'>
                                <Link href="/login">
                                    <a style={{color: 'LemonChiffon'}}>
                                        <h5>Log In</h5>
                                    </a>
                                </Link>
                            </div>
                            <div style={{borderBottom: '6px solid Cyan'}} className='py-2 mb-5'>
                                <Link href="/test">
                                    <a style={{color: 'Cyan'}}>
                                        <h5>Test topshirish</h5>
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
