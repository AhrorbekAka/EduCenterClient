import React, {useState} from "react";
import styles from "./layout.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBars,
    faChalkboardTeacher,
    faCog,
    faPlusSquare,
    faSignOutAlt,
    faUserGraduate,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {FormGroup, Input} from "reactstrap";
import StudentModal from "./modals/studentModal";
import Link from "next/link";
import {confirmAlertLogout} from "../services/confirmAlert";
import {logout, queryParam} from "../services/requestService";

export default function Sidebar({menu, title}){
    const [isOpen, setIsOpen] = useState(false)
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})
    const [studentModal, setStudentModal] = useState(false)
    const [student, setStudent] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const closeSidebar = () => {
        setIsOpen(false)
    }

    const callLogoutAlert = () => {
        confirmAlertLogout(logout)
    }

    const findStudent = async (e) => {
        if (e.target.value.length > 2) {
            const res = await queryParam({path: "/api/student/search", method: 'get', search: e.target.value})
            setPageStudent(res.data.object)
        } else {
            setPageStudent({content: [{lastName: '', firstName: ''}]})
        }
    }

    const openStudentModal = (stud) => {
        setStudent(stud)
        setStudentModal(true)
    }

    return (
        <div id="sidebar" className={styles.sidebar + ' ' + (isOpen ? styles.w70 : '')}>
            <div className='btn d-none d-md-inline-block bg-transparent text-white pr-md-0'
                 onClick={toggleSidebar}>
                <FontAwesomeIcon className='m-2' style={{fontSize: '30px'}} icon={faBars}/>
            </div>
            <FormGroup className='w-75 d-inline-block ml-1 my-1 my-md-0 ml-md-2'>
                <datalist id="findStudentOption">
                    {
                        pageStudent.content.map((stud, index) =>
                            <option onSelect={() => openStudentModal(stud)} key={index}
                                    value={stud.lastName + ' ' + stud.firstName}/>)
                    }
                </datalist>

                <Input list="findStudentOption" onChange={(event) => findStudent(event)} type="text"
                       name="searchedValue"
                       placeholder="Familiya, ism, ..."/>
                <StudentModal
                    isOpen={studentModal}
                    setOpen={setStudentModal}
                    payload={{student}}
                    // refresh={requestGroups}
                    // openPaymentModal={openPaymentModal}
                    // isEdit={isEditStudentModal}
                    // setEdit={setEditStudentModal}
                    // setEdit={setEditStudentModal}
                />
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
                    <button className='btn btn-link shadow-none p-0' onClick={callLogoutAlert}>
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

    )
}