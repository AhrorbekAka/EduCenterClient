import Link from "next/link";

export default function LoginLayout({children}) {
    return (
        <div className='row min-vh-100 m-0' style={{
            backgroundColor: '#a8dadc',
        }}>
            <div className="col-12 col-md-8 offset-md-2">
                <div className='row h-50 mt-md-5 pt-md-5'>
                    <div className="h-100 bg-info mt-md-5 col-md-6 text-white text-center d-inline-flex">
                        <div className='m-auto'>
                            <Link href='/'>
                                <a>
                                    <h1 className='m-auto text-white'>O'QUV MARKAZ</h1>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className='h-100 mt-md-5 pt col-md-6 bg-light d-flex'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}