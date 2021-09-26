import styles from './layout.module.css'
import Head from "next/head";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

import {
    faBars, faChalkboardTeacher,
    faCog,
    faLayerGroup,
    faPlusSquare,
    faSignOutAlt, faUserGraduate,
    faUsers,
    faUserShield
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default function Layout({children, home, loading, title}) {
    const [isOpen, setIsOpen] = useState(false)
    const [menu, setMenu] = useState([])

    useEffect(async () => {
        await setMenu(localStorage.getItem('menu'))
    }, [])

    const toggleSidebar = () => {
        if (isOpen) {
            closeSidebar()
        } else {
            openSidebar()
        }
        setIsOpen(!isOpen)
    }

    const openSidebar = () => {
        document.getElementById("sidebar").classList.add(styles.w70)
        setIsOpen(true)
        // document.getElementById("logo").innerText = 'O`QUV \n MARKAZI'
    }
    const closeSidebar = () => {
        document.getElementById("sidebar").classList.remove(styles.w70)
        setIsOpen(false)
        // document.getElementById("logo").innerText = ''

        loading = true
    }

    const logout = async () => {
        localStorage.removeItem("EducationCenterToken")
        localStorage.removeItem("menu")
    }

    if (loading) return (<div className='position-relative vh-100 vw-100 text-center'>
        <div
            className='position-absolute'
            style={{zIndex: '99', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Image src="/loading(2).gif"
                   alt="loading..."
                   width={40}
                   height={40}/>
            <br/>
            <p className='pl-3 pt-3'> Loading . . .</p>
        </div>
    </div>)
    else return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
            </Head>

            {home && children}

            {!home && (
                <div>
                    <div id="sidebar" className={styles.sidebar+' justify-content-center'}>
                        <div className='btn d-none d-md-inline-block bg-transparent text-white' onClick={toggleSidebar}>
                            <FontAwesomeIcon className='m-2' style={{fontSize: '30px'}} icon={faBars}/>
                        </div>
                        <h2 className={styles.logo+ ' d-none d-md-block'}>O`QUV <br/> MARKAZI</h2>

                        {menu > 1 && <Link href="/students">
                            <a>
                                <p className={styles.navLink+' px-2 pl-md-1'}>
                                    <FontAwesomeIcon className='my-md-1 mx-md-4' icon={faUserGraduate}/>
                                    <span>Studentlar</span>
                                </p>
                            </a>
                        </Link>}
                        {menu > 2 && <Link href="/employee">
                            <a>
                                <p className={styles.navLink+' px-2 px-md-0'}>
                                    <FontAwesomeIcon className='my-md-1 mx-md-4' icon={faChalkboardTeacher}/>
                                    <span>Ishchilar</span>
                                </p>
                            </a>
                        </Link>}
                        {menu > 0 && <>
                            <Link href="/groups">
                                <a>
                                    <p className={styles.navLink+' px-2 px-md-0'}>
                                        <FontAwesomeIcon className='my-md-2 mx-md-4' icon={faUsers}/>
                                        <span>Guruhlar</span>
                                    </p>
                                </a>
                            </Link>
                            <Link href="/testCRUD">
                                <a>
                                    <p className={styles.navLink+' px-2 pl-md-1 mr-5 mr-md-0'} onClick={closeSidebar}>
                                        <FontAwesomeIcon className='my-md-2 mx-md-4' icon={faPlusSquare}/>
                                        <span>Test yaratish</span>
                                    </p>
                                </a>
                            </Link>

                        </>}
                        <div className={styles.settingsLogout +' d-flex d-md-block'}>
                            <Link href="/settings">
                                <a>
                                    <p className={styles.navLink} onClick={closeSidebar}>
                                        <FontAwesomeIcon className='mx-2 mx-md-4' icon={faCog}/>
                                        <span style={{display: !isOpen ? 'none' : ''}}>Sozlamalar</span>
                                    </p>
                                </a>
                            </Link>
                            <Link href="/">
                                <a onClick={logout}>
                                    <p className={styles.navLink}>
                                        <FontAwesomeIcon className='mx-2 mx-md-4' icon={faSignOutAlt}/>
                                        <span style={{display: !isOpen ? 'none' : ''}}>Chiqish</span>
                                    </p>
                                </a>
                            </Link>
                        </div>
                    </div>
                    <main onClick={closeSidebar} className='min-vh-100 m-0 ml-md-5 p-0 p-md-3 pt-5' style={{boxSizing: 'border-box'}}>
                        <p style={{left: 0, right: 0, top: 0}}
                           className='bg-success text-white text-center position-absolute'>
                            Sayt test rejimida ishlamoqda
                        </p>
                        {children}
                    </main>
                </div>
            )}
        </div>
    )
}