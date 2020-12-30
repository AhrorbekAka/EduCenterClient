import styles from './layout.module.css'
import Head from "next/head";
import {useEffect, useState} from "react";
import Link from "next/link";

export default function Layout({children, home, loading, title}) {
    const [isOpen, setIsOpen] = useState(false)
    const [menu, setMenu] = useState([])

    useEffect(() => {
        setMenu(localStorage.getItem('menu'))
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
    }

    const logout = async () => {
        localStorage.removeItem("EducationCenterToken")
        localStorage.removeItem("menu")
    }

    if (loading) return (<div className='position-relative vh-100 vw-100 text-center'>
        <div
            className='position-absolute'
            style={{zIndex: '99', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            Loading . . .
        </div>
    </div>)
    else return (
        <div className={styles.container}>
            <Head>
                {/*<link rel={icon} href="/favicon.ico" />*/}
                <title>{title}</title>
            </Head>

            {home && children}

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
                    <main className='vh-100 m-0 m-md-3 p-0 p-md-3'>{
                        children
                    }</main>
                </>
            )}
        </div>
    )
}