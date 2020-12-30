import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {Button, FormGroup, Input} from "reactstrap";
import Modal from "reactstrap/lib/Modal";
import {useState} from "react";
import {queryData, queryParam} from "../services/requestService";


export default function StudentModal(props) {

    const [student, setStudent] = useState({})
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})

    const closeModal = () => {
        setStudent({})
        props.toggleModal(false)
    }

    const onSaveStudent = async () => {
        const newStudent = {
            id: student.id,
            firstName: document.getElementsByName("firstName")[0].value,
            lastName: document.getElementsByName("lastName")[0].value,
            phoneNumber: document.getElementsByName("phoneNumber")[0].value,
            parentsNumber: document.getElementsByName("parentsNumber")[0].value,
            address: document.getElementsByName("address")[0].value,
            groupIdList: [props.groupId]
        };
        queryData({
            path: '/api/student',
            method: 'post',
            ...newStudent
        }).then(res=>{
            alert(res.data.message)
            props.requestGroupList()
            closeModal()
        })
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

    return (
        <Modal isOpen={props.isOpen} toggle={closeModal} unmountOnClose={true}>
            <ModalHeader toggle={closeModal} className="bg-info text-white">
                Yangi abituriyent qo`shish
            </ModalHeader>
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
    )
}