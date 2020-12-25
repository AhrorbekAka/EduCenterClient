import styles from './layout.module.css'
import Head from "next/head";
import {useEffect, useState} from "react";
import Link from "next/link";
import axios from "axios"
import {queryData} from "../services/requestService";

export default function Layout({children, home}) {
    const [isOpen, setIsOpen] = useState(false)
    const [menu, setMenu] = useState([])

    useEffect(async () => {
        const {data} = await queryData({path: "/api/menu", method: 'get'})

        if(data.success){
            await setMenu(data.object)
        }
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
        document.getElementById("sidebar").style.width = '70%'
    }
    const closeSidebar = () => {
        document.getElementById("sidebar").style.width = '0'
    }

    const logout = async () => {
        localStorage.removeItem("EducationCenterToken")
    }

    return (
        <div className={styles.container}>
            <Head>
                {/*<link rel={icon} href="/favicon.ico" />*/}
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
                        {
                            menu.map(menuItem => (
                                <Link key={menuItem.id} href={("/" + menuItem.name.toLowerCase())}>
                                    <a className={styles.navLink}>
                                        <p onClick={closeSidebar}>{menuItem.name}</p>
                                    </a>
                                </Link>
                            ))
                        }


                        {/*<Link href="/employee">*/}
                        {/*    <a className={styles.navLink}>*/}
                        {/*        <p onClick={closeSidebar}>Ishchilar</p>*/}
                        {/*    </a>*/}
                        {/*</Link>*/}
                        {/*<Link href="/groups">*/}
                        {/*    <a className={styles.navLink}>*/}
                        {/*        <p onClick={closeSidebar}>Guruhlar</p>*/}
                        {/*    </a>*/}
                        {/*</Link>*/}
                        {/*<Link href="/students">*/}
                        {/*    <a className={styles.navLink}>*/}
                        {/*        <p onClick={closeSidebar}>O`quvchilar</p>*/}
                        {/*    </a>*/}
                        {/*</Link>*/}
                        <Link href="/">
                            <a onClick={logout} className={styles.navLink}>
                                <p>Chiqish</p>
                            </a>
                        </Link>
                    </div>
                    <main className='vh-100 m-0 m-md-3 p-0 p-md-3'>{children}</main>
                </>
            )}
        </div>
    )
}