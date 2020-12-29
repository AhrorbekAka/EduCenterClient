import Layout from "../components/layout";
import axios from "axios"
import React from 'react'
import {useState, useEffect} from 'react'

import {
    FormGroup,
    Input,
    Button,
    Card,
    CardHeader,
    CardBody,
    Collapse,
    Container,
    Row,
    Col,
} from "reactstrap";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {queryData, queryParam} from "../services/requestService";

export default function Groups() {

    const [openedCollapse, setOpenedCollapse] = React.useState("")
    const [data, setData] = useState([])
    useEffect(() => {
        requestGroupList()
    }, [])

    const requestGroupList = async () => {
        const res = await queryData({path: '/api/groups', method: 'get'})
        setData(res.data.object)
    }

    const [studentModal, setStudentModal] = useState(false)
    const [student, setStudent] = useState({id: ''})
    const [newStudentGroupId, setNewStudentGroupId] = useState('')
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})

    const openStudentModal = (groupId) => {
        setNewStudentGroupId(groupId)
        toggleStudentModal()
    }
    const toggleStudentModal = () => {
        setStudent({})
        setStudentModal(!studentModal)
    }
    const onSaveStudent = async () => {
        const newStudent = {
            id: student.id,
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
        requestGroupList()
        toggleStudentModal()
    }

    const studentChangeHandler = async (e) => {
        if (e.target.value.length === 36) {
            const studentId = document.getElementsByName(e.target.name)[0].value
            for (const student of pageStudent.content) {
                if (student.id === studentId) {
                    setStudent(student)
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

    return (
        <Layout>
            <div className=" accordion-1">
                <Container>
                    <Row><Col className='p-0' md='12'>
                        <div className=" accordion my-3" id="accordionExample">
                            {data.map((group, index) =>
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
                                        </div>
                                    </CardHeader>
                                    <Collapse
                                        isOpen={openedCollapse === group.id.toString()}
                                        aria-labelledby={index}
                                        data-parent="#accordionExample"
                                        id={group.id.toString()}
                                    >
                                        <CardBody className="opacity-8 p-0 table-responsive ">
                                            <table className='table table-dark m-0'>
                                                <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>FIO</th>
                                                    <th>Telefon №</th>
                                                    <th>
                                                        <button onClick={() => openStudentModal(group.id)}
                                                                className='badge badge-primary'><strong>+</strong>
                                                        </button>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>{
                                                    group.students.length > 0 ?
                                                        group.students.map((student, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{student.lastName + " " + student.firstName}</td>
                                                                <td>{student.phoneNumber}</td>
                                                            </tr>
                                                        )) :
                                                        <tr>
                                                            <td colSpan='4' className='text-center m-0 p-2'>Bu guruhga
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
            </div>

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
                               defaultValue={student.lastName} name="lastName"
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
                               defaultValue={student.firstName} name="firstName"
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
                               defaultValue={student.phoneNumber} name="phoneNumber"
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
                               defaultValue={student.parentsNumber} name="parentsNumber"
                               placeholder="Ota-onasining telefon raqami"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="text" defaultValue={student.address} name="address"
                               placeholder="Manzili"/>
                    </FormGroup>
                    <FormGroup className="text-right">
                        <Button color="success" onClick={onSaveStudent}>Saqlash</Button>
                    </FormGroup>
                </ModalBody>
            </Modal>
        </Layout>
    )
}