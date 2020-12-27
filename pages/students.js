import Layout from "../components/layout";
import Head from "next/head";
import React, {useState, useEffect} from 'react'
import {queryData, queryParam} from "../services/requestService";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, FormGroup, Input, Label, Row} from "reactstrap";

export default function Students() {
    const [groups, setGroups] = useState([{id: '', students: []}])
    const [modal, setModal] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])
    const [teacherIdList, setTeacherIdList] = useState([])
    const [group, setGroup] = useState({id: ''})

    const [modalOpen, setModalOpen] = useState(false)
    const [student, setStudent] = useState()
    const [openedCollapse, setOpenedCollapse] = React.useState("")

    useEffect(() => {
        requestStudents()
    }, [])

    const requestStudents = async () => {
        const res = await queryData({path: "/api/student", method: "get"})
        setGroups(res.data.object)
    }


    const openModal = () => {
        queryParam({
            path: '/api/subject',
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                setSubjects(response.data.object)
            }
        });

        queryParam({
            path: '/api/user',
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                const idList = [];
                for (let teacher of response.data.object) {
                    idList.push({teacherId: teacher.id, isTeacher: false});
                }
                setTeachers(response.data.object)
                setTeacherIdList(idList)
            }
        });
        toggleModal();
    };

    const toggleModal = () => setModal(!modal)

    const onSave = async () => {
        const teacherIds = [];
        for (let item of teacherIdList) {
            if (item.isTeacher) {
                teacherIds.push(item.teacherId)
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
        requestStudents()
        toggleModal()
    };

    const onSelectTeacher = (id) => {
        for (let item of teacherIdList) {
            if (item.teacherId === id) {
                item.isTeacher = !item.isTeacher
            }
        }
        setTeacherIdList(teacherIdList)
    };

    const onEdit = (groupIndex) => {
        setGroup(groups[groupIndex]);
        toggleModal()
    };

    const onDelete = async (groupId) => {
        await queryParam({
            path: '/api/groups/closeOrReopen',
            method: 'patch',
            groupId
        });
        requestStudents()
    };

    const [studentModal, setStudentModal] = useState(false)
    const [modalStudent, setModalStudent] = useState({id: ''})
    const [newStudentGroupId, setNewStudentGroupId] = useState('')
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})

    const openStudentModal = (groupId) => {
        setNewStudentGroupId(groupId)
        toggleStudentModal()
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
        requestStudents()
        toggleStudentModal()
    }

    const studentChangeHandler = async (e) => {
        if(e.target.value.length===36) {
            const studentId = document.getElementsByName(e.target.name)[0].value
            for(const student of pageStudent.content){
                if(student.id===studentId){
                    setModalStudent(student)
                    document.getElementsByName(e.target.name)[0].value = student[e.target.name]
                }
            }
        }else if (e.target.value.length > 2) {
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
        const paymentAmount = document.getElementById("payment").value
        if (paymentAmount.length > 0 && paymentAmount > 0) {
            await queryData({path: '/api/student/payment', method: 'patch', paymentAmount, ...student})
            await requestStudents()
            togglePaymentModal()
        } else {
            alert('Noto`g`ri qiymat kiritdingiz')
            //pop-up
        }
    }

    return (
        <Layout>
            <Head>
                <title>Students</title>
            </Head>

            <Container>
                <Row><Col className='text-center pt-2'><Button color={'success'} onClick={openModal}>Guruh
                    qo`shish</Button></Col></Row>
                <Row><Col className='p-0' md='12'>
                    <div className=" accordion my-3" id="accordionExample">
                        {groups.map((group, index) =>
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
                                        <button onClick={() => onDelete(group.id)}
                                                className='position-absolute btn btn-light px-1'
                                                style={{zIndex: '10', right: '5px'}}>❌
                                        </button>
                                    </div>
                                </CardHeader>
                                <Collapse
                                    isOpen={openedCollapse === group.id.toString()}
                                    aria-labelledby={index}
                                    data-parent="#accordionExample"
                                    id={group.id.toString()}
                                >
                                    <CardBody className="opacity-8 p-0">
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
                                                group.students.length > 0 ?
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
                                                    </tr>
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
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal} className="bg-info text-white">Yangi guruh qo`shish</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Input type="text" defaultValue={group.name} name="name"
                               placeholder="Guruh nomi"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="select" name="subjectName" defaultValue={group.subjectName}>
                            <option>Fanni tanlash</option>
                            {subjects.map((subject, index) => <option
                                key={index}>{subject.subjectName}</option>)}
                        </Input>
                    </FormGroup>
                    <div className="border rounded px-3 py-2 mb-3">
                        <h6>O`qituvchilar: </h6>
                        {teachers.map((teacher, index) =>
                            <FormGroup key={index} check className="ml-3"
                                       onChange={() => onSelectTeacher(teacher.id)}>
                                <Label check>
                                    <Input type="checkbox"/>
                                    <h6>{teacher.firstName + ' ' + teacher.lastName}</h6>
                                </Label>
                            </FormGroup>
                        )}
                    </div>
                    <FormGroup>
                        <Input type="text" defaultValue={group.payment} name="payment"
                               placeholder="Bu guruh uchun boshlang`ich tolovni kirting"/>
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
                    <button onClick={savePayment} className='button-top btn btn-info mt-3'>Save</button>
                </ModalBody>
            </Modal>
        </Layout>
    )
}