import styles from './layout.module.css'
import Head from "next/head";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

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
    }
    const closeSidebar = () => {
        document.getElementById("sidebar").classList.remove(styles.w70)
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
                {/*<link rel={icon} href="/favicon.ico" />*/}
                <title>{title}</title>
            </Head>

            {home && children}
            {/*{!!home && <div className='w-100 position-relative'>*/}
            {/*    <p*/}
            {/*        style={{right: 0, left:0}}*/}
            {/*        className='text-center text-white bg-warning position-absolute'>Sayt test*/}
            {/*    rejimida ishlamoqda</p>{children}</div>}*/}

            {!home && (
                <>
                    <div id="sidebar" className={styles.sidebar}>
                        <span className={styles.toggleButton}>
                            <button className='btn btn-dark p-1' style={{lineHeight: '5px'}} onClick={toggleSidebar}>
                                <p className='p-0 m-1 border-top' style={{width: '18px', height: '3px'}}> </p>
                                <p className='p-0 m-1 border-top' style={{width: '18px', height: '3px'}}> </p>
                                <p className='p-0 m-1 border-top' style={{width: '18px', height: '3px'}}> </p>
                            </button></span>
                        <h2 style={{overflow: 'hidden'}} className={styles.logo}>O`QUV MARKAZI</h2>

                        {menu > 1 && <Link href="/students">
                            <a className={styles.navLink}>
                                <p>STUDENTLAR</p>
                            </a>
                        </Link>}
                        {menu > 2 && <Link href="/employee">
                            <a className={styles.navLink}>
                                <p>IShChILAR</p>
                            </a>
                        </Link>}
                        {menu > 0 && <>
                            <Link href="/groups">
                                <a className={styles.navLink}>
                                    <p>GURUHLAR</p>
                                </a>
                            </Link>
                            <Link href="/testCRUD">
                                <a className={styles.navLink}>
                                    <p onClick={closeSidebar}>TEST</p>
                                </a>
                            </Link>
                            <Link href="/settings">
                                <a className={styles.navLink}>
                                    <p onClick={closeSidebar}>SOZLAMALAR</p>
                                </a>
                            </Link>
                        </>}
                        <Link href="/">
                            <a onClick={logout} className={styles.navLink}>
                                <p>ChIQISh</p>
                            </a>
                        </Link>
                    </div>
                    <main className='min-vh-100 m-0 p-0 pt-3 p-md-3'>
                        <p style={{left: 0, right: 0, top: 0}} className='bg-success text-white text-center position-absolute'>
                            Sayt test rejimida ishlamoqda
                        </p>
                        {children}
                    </main>
                </>
            )}
        </div>
    )
}