import Layout from "../components/layout";
import Head from "next/head";
import React, {useState, useEffect} from 'react'
import {queryData, queryParam} from "../services/requestService";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, FormGroup, Input, Label, Row} from "reactstrap";
import StudentModal from "../components/studentModal";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function Students() {
    const [groups, setGroups] = useState([])
    const [modal, setModal] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])
    const [group, setGroup] = useState({id: '', teachers: [], subject: {}})
    const [isDeletedGroupPage, setDeletedGroupPage] = useState(true)

    const [modalOpen, setModalOpen] = useState(false)
    const [student, setStudent] = useState()
    const [openedCollapse, setOpenedCollapse] = React.useState("")

    useEffect(() => {
        requestGroups()
    }, [])

    const requestGroups = async () => {
        const res = await queryParam({path: "/api/groups/with-s-balance", method: "get"})
        setGroups(res.data.object)
    }


    const togglePage = () =>{
        setDeletedGroupPage(!isDeletedGroupPage)
        requestDeletedGroups()
    }
    const requestDeletedGroups = async () => {
        if(isDeletedGroupPage){
            const res = await queryParam({path: "/api/groups/with-s-balance", method: "get", isPresent: false})
            setGroups(res.data.object)
        } else {
            requestGroups()
        }
        setDeletedGroupPage(!isDeletedGroupPage)
    }

    const openModal = async (chosenGroup) => {
        await queryParam({
            path: '/api/subject',
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                setSubjects(response.data.object)
            }
        });

        await queryParam({
            path: '/api/user',
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                const teacherList = [];
                for (let teacher of response.data.object) {
                    if (chosenGroup.teachers.length > 0) {
                        teacher['isTeacher'] = false
                        for (const teacher1 of chosenGroup.teachers) {
                            if (teacher.id === teacher1.id) {
                                teacher['isTeacher'] = true
                                break
                            }
                        }
                    } else {
                        teacher['isTeacher'] = false
                    }
                }
                setTeachers(response.data.object)
            }
        });
        setModal(true);
    };

    const closeModal = () => {
        setModal(false)
        setGroup({id: '', teachers: [], subject: {}})
    }

    const onSave = async () => {
        const teacherIds = [];
        for (let item of teachers) {
            if (item.isTeacher) {
                teacherIds.push(item.id)
            }
        }
        const newGroup = {
            id: group.id,
            name: document.getElementsByName("name")[0].value,
            teacherIdList: teacherIds,
            subjectName: document.getElementsByName("subjectName")[0].value,
            payment: document.getElementsByName("payment")[0].value,
            description: document.getElementsByName("description")[0].value,
        };
        // setGroup(newGroup);
        await queryData({
            path: '/api/groups',
            method: 'post',
            ...newGroup
        });
        requestGroups()
        closeModal()
    };

    const onSelectTeacher = (id) => {
        for (let item of teachers) {
            if (item.id === id) {
                item.isTeacher = !item.isTeacher
            }
        }
        setTeachers(teachers)
    };

    const onEdit = (groupIndex) => {
        const chosenGroup = groups[groupIndex]
        setGroup(chosenGroup);
        openModal(chosenGroup)
    };

    const onDelete = (group) => {
        confirmAlert({
            title: 'Guruhni o`chirish',
            message: <p><strong>{group.name}</strong> {isDeletedGroupPage? 'guruhini o`chirmoqchimisiz':'guruhni tiklamoqchimisiz'}</p>,
            buttons: [
                {
                    label: 'Ha',
                    onClick: () => deleteGroup(group.id)
                },
                {
                    label: 'Yo`q',
                    // onClick: () => alert('Click No')
                }
            ]
        });
    };

    const deleteGroup = async (groupId) => {
        await queryParam({
            path: '/api/groups/closeOrReopen',
            method: 'patch',
            groupId
        });
        requestGroups()
    };

    const [studentModal, setStudentModal] = useState(false)
    const [modalStudent, setModalStudent] = useState({id: ''})
    const [newStudentGroupId, setNewStudentGroupId] = useState('')
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})
    const [studentPayload, setStudentPayload] = useState({isOpen: false, groupId: ''})

    const openStudentModal = (groupId) => {
        setNewStudentGroupId(groupId)
        setStudentPayload({isOpen: true, groupId})

        // StudentModal({groupId})
        // setNewStudentGroupId(groupId)
        // toggleStudentModal()
    }

    const toggleStudentModal = () => {
        setModalStudent({})
        setStudentModal(!studentModal)
    }
    const onSaveStudent = async () => {
        const newStudent = {
            id: modalStudent.id,
            firstName: document.getElementsByName("firstName")[0].value,
            lastName: document.getElementsByName("lastName")[0].value,
            phoneNumber: document.getElementsByName("phoneNumber")[0].value,
            parentsNumber: document.getElementsByName("parentsNumber")[0].value,
            address: document.getElementsByName("address")[0].value,
            groupIdList: [newStudentGroupId]
        };
        await queryData({
            path: '/api/student',
            method: 'post',
            ...newStudent
        });
        requestGroups()
        toggleStudentModal()
    }

    const studentChangeHandler = async (e) => {
        if (e.target.value.length === 36) {
            const studentId = document.getElementsByName(e.target.name)[0].value
            for (const student of pageStudent.content) {
                if (student.id === studentId) {
                    setModalStudent(student)
                    document.getElementsByName(e.target.name)[0].value = student[e.target.name]
                }
            }
        } else if (e.target.value.length > 2) {
            const res = await queryParam({path: "/api/student/search", method: 'get', search: e.target.value})
            setPageStudent(res.data.object)
        }
    }

    const fillStudentModal = (inputName) => {
        alert('wow')
        console.log(document.getElementsByName(inputName)[0].value)
    }

    const openPaymentModal = (selectedStudent, groupId) => {
        setStudent({groupId, ...selectedStudent})
        togglePaymentModal()
    }
    const togglePaymentModal = () => {
        setModalOpen(!modalOpen)
    }

    const savePayment = async () => {
        document.getElementById('paymentSubmitBtn').disabled=true
        const paymentAmount = document.getElementById("payment").value
        if (paymentAmount.length > 0 && paymentAmount > 0) {
            await queryData({path: '/api/student/payment', method: 'patch', paymentAmount, ...student}).then(res=>
                document.getElementById('paymentSubmitBtn').disabled = false
        )
            await requestGroups()
            togglePaymentModal()
        } else {
            alert('Noto`g`ri qiymat kiritdingiz')
            pop-up
        }
    }

    return (
        <Layout>
            <Head>
                <title>Students</title>
            </Head>

            <Container>
                <Row><Col className='text-center pt-2'>
                    <Button className='mb-1 text-white' color={isDeletedGroupPage?'warning':'info'} onClick={requestDeletedGroups}>{isDeletedGroupPage?'Deleted':'Present'}</Button>
                    <br/>
                    <Button disabled={!isDeletedGroupPage} color={'success'} onClick={() => openModal({teachers: []})}>
                        Guruh qo`shish
                    </Button>
                </Col></Row>
                <Row><Col className='p-0' md='12'>
                    <div className=" accordion my-3" id="accordionExample">
                        {groups&&groups.map((group, index) =>
                            <Card key={index}>
                                <CardHeader
                                    className='p-0'
                                    id={index}
                                    aria-expanded={openedCollapse === group.id.toString()}
                                >
                                    <div className="mb-0 position-relative">
                                        <Button
                                            onClick={() =>
                                                setOpenedCollapse(
                                                    openedCollapse === group.id.toString()
                                                        ? ""
                                                        : group.id.toString()
                                                )
                                            }
                                            className='font-weight-bold text-decoration-none w-100 text-monospace text-uppercase'
                                            color="link"
                                        >
                                            {group.name}
                                        </Button>
                                        <button onClick={() => onEdit(index)} color={''}
                                                className='position-absolute btn btn-light px-1'
                                                style={{zIndex: '1', right: '5px'}}>✏️
                                        </button>
                                        <button onClick={() => onDelete(group)}
                                                className='position-absolute btn btn-light px-1'
                                                style={{zIndex: '1', left: '0'}}>❌
                                        </button>
                                    </div>
                                </CardHeader>
                                <Collapse
                                    isOpen={openedCollapse === group.id.toString()}
                                    aria-labelledby={index}
                                    data-parent="#accordionExample"
                                    id={group.id.toString()}
                                >
                                    <CardBody className="opacity-8 p-0  table-responsive">
                                        <table className='table table-dark m-0'>
                                            <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>FIO</th>
                                                <th>Balance</th>
                                                <th>Telefon №</th>
                                                <th className='d-none d-md-table-cell'>Ota(Ona)sining raqami</th>
                                                <th className='d-none d-md-table-cell'>Address</th>
                                                <th>
                                                    <button onClick={() => openStudentModal(group.id)}
                                                            className='badge badge-primary'><strong>+</strong>
                                                    </button>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>{
                                                group.students&&(group.students.length > 0 ?
                                                    group.students.map((student, i) => (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{student.lastName + " " + student.firstName}</td>
                                                            <td>
                                                                <button
                                                                    onClick={() => openPaymentModal(student, group.id)}
                                                                    className={(student.balance > 0 ? 'btn btn-success' : 'btn btn-danger')}>
                                                                    {student.balance.toLocaleString()}
                                                                </button>
                                                            </td>
                                                            <td>{student.phoneNumber}</td>
                                                            <td className='d-none d-md-table-cell'>{student.parentsNumber}</td>
                                                            <td className='d-none d-md-table-cell'>{student.address}</td>
                                                        </tr>
                                                    )) :
                                                    <tr>
                                                        <td colSpan='15' className='text-center m-0 p-2'>Bu guruhga
                                                            o`quvchi qo`shilmagan
                                                        </td>
                                                    </tr>)
                                            }</tbody>
                                        </table>
                                    </CardBody>
                                </Collapse>
                            </Card>)}
                    </div>
                </Col>
                </Row>
            </Container>

            {/*Save Group Modal*/}
            <Modal isOpen={modal} toggle={closeModal}>
                <ModalHeader toggle={closeModal} className="bg-info text-white">Yangi guruh qo`shish</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input type="text" defaultValue={group.name} name="name"
                               placeholder="Guruh nomi"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="select" name="subjectName" defaultValue={group.subject.subjectName}>
                            {!group.subject.subjectName ? <>
                                    <option>Fanni tanlash</option>
                                    {subjects.map((subject, index) => <option
                                        key={index}>{subject.subjectName}</option>)}
                                </> :
                                <option selected={true} >{group.subject.subjectName}</option>}

                        </Input>
                    </FormGroup>
                    <div className="border rounded px-3 py-2 mb-3">
                        <h6>O`qituvchilar: </h6>
                        {teachers.map((teacher, index) =>
                            <FormGroup key={index} check className="ml-3"
                                       onChange={() => onSelectTeacher(teacher.id)}>
                                <Label check>
                                    <Input type="checkbox" defaultChecked={teacher.isTeacher}/>
                                    <h6>{teacher.firstName + ' ' + teacher.lastName}</h6>
                                </Label>
                            </FormGroup>
                        )}
                    </div>
                    <FormGroup>
                        <Input type="text" defaultValue={group.payment} name="payment"
                               placeholder="Bu guruh uchun boshlang`ich to`lovni kirting"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="text" defaultValue={group.description} name="description"
                               placeholder="Qo`shimcha ma`lumot"/>
                    </FormGroup>
                    <FormGroup className="text-right">
                        <Button onClick={onSave} type="submit" color="success">Saqlash</Button>
                    </FormGroup>
                </ModalBody>
            </Modal>

            <StudentModal payload={studentPayload}/>

            {/*Save Student Modal*/}
            <Modal isOpen={studentModal} toggle={toggleStudentModal} unmountOnClose={true}>
                <ModalHeader toggle={toggleStudentModal} className="bg-info text-white">Yangi abituriyent
                    qo`shish</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <datalist id="lastNameOption">
                            {
                                pageStudent.content.map((stud, index) =>
                                    <option key={index} value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                            }
                        </datalist>

                        <Input list="lastNameOption" onChange={(event) => studentChangeHandler(event)} type="text"
                               defaultValue={modalStudent.lastName} name="lastName"
                               placeholder="Familiya"/>
                    </FormGroup>
                    <FormGroup>
                        <datalist id="firstNameOption">
                            {
                                pageStudent.content.map((stud, index) =>
                                    <option key={index} value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                            }
                        </datalist>
                        <Input list="firstNameOption" onChange={(event) => studentChangeHandler(event)} type="text"
                               defaultValue={modalStudent.firstName} name="firstName"
                               placeholder="Ism"/>
                    </FormGroup>
                    <FormGroup>
                        <datalist id="phoneNumberOption">
                            {
                                pageStudent.content.map((stud, index) =>
                                    <option key={index} value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                            }
                        </datalist>
                        <Input list="phoneNumberOption" onChange={(event) => studentChangeHandler(event)} type="text"
                               defaultValue={modalStudent.phoneNumber} name="phoneNumber"
                               placeholder="Telefon raqami"/>
                    </FormGroup>
                    <FormGroup>
                        <datalist id="parentsNumberOption">
                            {
                                pageStudent.content.map((stud, index) =>
                                    <option key={index} value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                            }
                        </datalist>
                        <Input list="parentsNumberOption" onChange={(event) => studentChangeHandler(event)} type="text"
                               defaultValue={modalStudent.parentsNumber} name="parentsNumber"
                               placeholder="Ota-onasining telefon raqami"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="text" defaultValue={modalStudent.address} name="address"
                               placeholder="Manzili"/>
                    </FormGroup>
                    <FormGroup className="text-right">
                        <Button color="success" onClick={onSaveStudent}>Saqlash</Button>
                    </FormGroup>
                </ModalBody>
            </Modal>

            <Modal className='modal-right' isOpen={modalOpen} toggle={togglePaymentModal}>
                <ModalHeader toggle={togglePaymentModal}>To`ov miqdorini kiriting</ModalHeader>
                <ModalBody className='text-right'>
                    <input id="payment" placeholder='Summa' className='form-control input-group' type="text"/>
                    <button id='paymentSubmitBtn' onClick={savePayment} className='button-top btn btn-info mt-3'>Save</button>
                </ModalBody>
            </Modal>
        </Layout>
    )
}