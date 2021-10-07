import React, {useEffect, useState} from "react";
import styles from './layout.module.css'
import Head from "next/head";
import Sidebar from "./sidebar";
import MainWindow from "./mainWindow";

export default function Layout({children, home, loading, title}) {
    const [menu, setMenu] = useState([])

    useEffect(() => {
        setMenu(localStorage.getItem('menu'))
    }, [])

    if (home)
        return children
    else
        return (
            <div className={styles.container}>
                <Head>
                    <title>{title}</title>
                </Head>
                <Sidebar menu={menu} title={title}/>
                <MainWindow menu={menu} title={title} children={children} loading={loading}/>
            </div>
        )
}