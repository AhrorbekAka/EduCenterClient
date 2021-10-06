import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import {Button, FormGroup, Input} from "reactstrap";
import Modal from "reactstrap/lib/Modal";
import {useState} from "react";
import {queryData, queryParam} from "../../services/requestService";
import AbstractModal from "./abstractModal";


export default function StudentModal({isOpen, setOpen, payload, refresh, openPaymentModal, isEdit}) {

    const [loading, setLoading] = useState(false)
    const [student, setStudent] = useState(!payload.student?{}:payload.student)
    const [pageStudent, setPageStudent] = useState({content: [{lastName: '', firstName: ''}]})

    // const closeModal = () => {
    //     setStudent({})
    //     props.toggleModal(false)
    // }

    const onSaveStudent = async () => {
        setLoading(true)
        const newStudent = {
            id: student.id,
            firstName: document.getElementsByName("firstName")[0].value,
            lastName: document.getElementsByName("lastName")[0].value,
            phoneNumber: document.getElementsByName("phoneNumber")[0].value,
            parentsNumber: document.getElementsByName("parentsNumber")[0].value,
            address: document.getElementsByName("address")[0].value,
            groupIdList: [payload.selectedGroupId!=null?payload.selectedGroupId:null]
        };
        queryData({
            path: '/api/student',
            method: 'post',
            ...newStudent
        }).then(res => {
            setStudent({})
            setLoading(false)
            setOpen(false)
            refresh()
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
        <AbstractModal
            isOpen={isOpen}
            setOpen={setOpen}
            submit={onSaveStudent}
            loading={loading}
            header={isEdit?'Tahrirlash':'Yangi abituriyent qo`shish'}
        >
            <FormGroup>
                <datalist id="lastNameOption">
                    {
                        pageStudent.content.map((stud, index) =>
                            <option key={index} value={stud.id}>{stud.lastName + ' ' + stud.firstName}</option>)
                    }
                </datalist>

                <Input disabled={isEdit} list="lastNameOption" onChange={(event) => studentChangeHandler(event)} type="text"
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
                <Input disabled={isEdit} list="firstNameOption" onChange={(event) => studentChangeHandler(event)} type="text"
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
                <Input disabled={isEdit} list="phoneNumberOption" onChange={(event) => studentChangeHandler(event)} type="text"
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
                <Input disabled={isEdit} list="parentsNumberOption" onChange={(event) => studentChangeHandler(event)} type="text"
                       defaultValue={student.parentsNumber} name="parentsNumber"
                       placeholder="Ota-onasining telefon raqami"/>
            </FormGroup>
            <FormGroup>
                <Input disabled={isEdit} type="text" defaultValue={student.address} name="address"
                       placeholder="Manzili"/>
            </FormGroup>
            {/*<FormGroup>*/}
            {/*    <Button*/}
            {/*        onClick={() => openPaymentModal(student, group)}*/}
            {/*        className={(student.balance >= 0 ? 'btn btn-success' : 'btn btn-danger')}>*/}
            {/*        {console.log(student)}*/}
            {/*        {student.balance}*/}
                    {/*{student.balance!=null?student.balance.toLocaleString():0}*/}
                {/*</Button>*/}
            {/*</FormGroup>*/}
        </AbstractModal>
    )
}