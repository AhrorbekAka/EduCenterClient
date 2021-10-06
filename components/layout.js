import styles from './layout.module.css'
import Head from "next/head";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import Router from 'next/router'

import {
    faBars,
    faChalkboardTeacher,
    faCog,
    faPlusSquare,
    faSignOutAlt,
    faUserGraduate,
    faUsers
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FormGroup, Input} from "reactstrap";
import {queryParam} from "../services/requestService";
import {confirmAlertLogout} from "../services/confirmAlert";


export default function Layout({children, home, loading, title}) {
    const [isOpen, setIsOpen] = useState(false)
    const [menu, setMenu] = useState([])
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})

    useEffect(async () => {
        await setMenu(localStorage.getItem('menu'))
    }, [])

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const closeSidebar = () => {
        setIsOpen(false)
        loading = true
    }

    const logout = () => {
        confirmAlertLogout(removeTokenAndPushToHome)
    }

    const removeTokenAndPushToHome = () => {
        Router.push('/')
        localStorage.removeItem("EducationCenterToken")
        localStorage.removeItem("menu")
    }

    const findStudent = async (e) => {
        if (e.target.value.length > 2) {
            const res = await queryParam({path: "/api/student/search", method: 'get', search: e.target.value})
            setPageStudent(res.data.object)
        } else {
            setPageStudent({content: [{lastName: '', firstName: ''}]})
        }
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
                    <div id="sidebar" className={styles.sidebar + ' ' + (isOpen ? styles.w70 : '')}>
                        <div className='btn d-none d-md-inline-block bg-transparent text-white pr-md-0'
                             onClick={toggleSidebar}>
                            <FontAwesomeIcon className='m-2' style={{fontSize: '30px'}} icon={faBars}/>
                        </div>
                        <FormGroup className='w-75 d-inline-block ml-1 my-1 my-md-0 ml-md-2'>
                            <datalist id="findStudentOption">
                                {
                                    pageStudent.content.map((stud, index) =>
                                        <option key={index}
                                                value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                                }
                            </datalist>

                            <Input list="findStudentOption" onChange={(event) => findStudent(event)} type="text"
                                   name="lastName"
                                   placeholder="Familiya, ism, ..."/>
                        </FormGroup>
                        <div>
                            <h2 className={styles.logo + ' pl-2 pb-2 pt-1 pt-md-0 d-none d-md-block'}>O`quv markazi</h2>
                            <div className={styles.settingsLogout + ' d-flex d-md-block'}>
                                <Link href="/settings">
                                    <a>
                                        <p className={styles.navLink + ' ' + (title === 'Sozlamalar' ? styles.currentPage : '')}
                                           onClick={closeSidebar}>
                                            <FontAwesomeIcon className='mx-2 mx-md-4' icon={faCog}/>
                                            <span style={{display: !isOpen ? 'none' : ''}}>Sozlamalar</span>
                                        </p>
                                    </a>
                                </Link>
                                <button className='btn btn-link shadow-none p-0' onClick={logout}>
                                    <p className={styles.navLink}>
                                        <FontAwesomeIcon className='mx-2 mx-md-4' icon={faSignOutAlt}/>
                                        <span style={{display: !isOpen ? 'none' : ''}}>Chiqish</span>
                                    </p>
                                </button>
                            </div>
                        </div>

                        <div className={styles.navBlock + ' row py-1'}>
                            {menu > 1 && <div className={(menu === 2 ? 'col-4' : 'col-3') + ' col-md-12'}>
                                <Link href="/students">
                                    <a>
                                        <p className={styles.navLink + ' ' + (title === 'Studentlar' ? styles.currentPage : '')}>
                                            <FontAwesomeIcon className='my-md-1 ml-md-2 mr-md-4' icon={faUserGraduate}/>
                                            <span>Studentlar</span>
                                        </p>
                                    </a>
                                </Link>
                            </div>}
                            {menu > 2 && <div className={'col-3 col-md-12'}>
                                <Link href="/employee">
                                    <a>
                                        <p className={styles.navLink + ' ' + (title === 'Ishchilar' ? styles.currentPage : '')}>
                                            <FontAwesomeIcon className='my-md-1 ml-md-2 mr-md-4'
                                                             icon={faChalkboardTeacher}/>
                                            <span>Ishchilar</span>
                                        </p>
                                    </a>
                                </Link>
                            </div>}
                            {menu > 0 && <div className={(menu === 2 ? 'col-4' : 'col-3') + ' col-md-12'}>
                                <Link href="/groups">
                                    <a>
                                        <p className={styles.navLink + ' ' + (title === 'Guruhlar' ? styles.currentPage : '')}>
                                            <FontAwesomeIcon className='my-md-2 ml-md-2 mr-md-4' icon={faUsers}/>
                                            <span>Guruhlar</span>
                                        </p>
                                    </a>
                                </Link>
                            </div>}
                            {menu > 0 && <div className={(menu === 2 ? 'col-4' : 'col-3') + ' col-md-12'}>
                                <Link href="/testCRUD">
                                    <a>
                                        <p className={styles.navLink + ' ' + (title === 'Test' ? styles.currentPage : '')}
                                           onClick={closeSidebar}>
                                            <FontAwesomeIcon className='my-md-2 ml-md-2 mr-md-4' icon={faPlusSquare}/>
                                            <span>Test yaratish</span>
                                        </p>
                                    </a>
                                </Link>
                            </div>}
                        </div>
                    </div>
                    <main onClick={closeSidebar} className={' min-vh-100 m-0 ml-md-5 p-md-3'}
                          style={{boxSizing: 'border-box', paddingBottom: '55px'}}>
                        <p style={{left: 0, right: 0, top: 0}}
                           className='bg-success text-white text-center position-absolute d-none d-md-block'>
                            Sayt test rejimida ishlamoqda
                        </p>
                        {children}
                    </main>
                </div>
            )}
        </div>
    )
}