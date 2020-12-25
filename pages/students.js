import Layout from "../components/layout";
import Head from "next/head";
import axios from "axios";
import {useState, useEffect} from 'react'
import {queryData} from "../services/requestService";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";

export default function Students() {
    const [groups, setGroups] = useState([{students: []}])
    const [modalOpen, setModalOpen] = useState(false)
    const [student, setStudent] = useState({})
    useEffect(() => {
        requestStudents()
    }, [])

    const requestStudents = async () => {
        const res = await queryData({path: "/api/student", method: "get"})
        setGroups(res.data.object)
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
        if(paymentAmount.length>0 && paymentAmount > 0){
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
            <table className='table table-dark'>
                <thead>
                <tr>
                    <th>№</th>
                    <th>FIO</th>
                    <th>Balance</th>
                    <th>Telefon №</th>
                    <th className='d-none d-md-table-cell'>Ota(Ona)sining raqami</th>
                    <th className='d-none d-md-table-cell'>Address</th>
                </tr>
                </thead>
                {
                    groups.map((group, index) =>
                        <tbody key={index}>
                        <tr className='text-center text-monospace '>
                            <td colSpan='4' className='d-md-none'>
                                <strong>{group.name}</strong>
                            </td>
                            <td colSpan='6' className='d-none d-md-table-cell'>
                                <strong>{group.name}</strong>
                            </td>
                        </tr>

                        {group.students.map((student, i) => (

                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{student.lastName + " " + student.firstName}</td>
                                    <td>
                                        <button onClick={()=>openPaymentModal(student, group.id)} className={(student.balance>0?'btn btn-success':'btn btn-danger')}>
                                            {student.balance.toLocaleString()}
                                        </button>
                                    </td>
                                    <td>{student.phoneNumber}</td>
                                    <td className='d-none d-md-table-cell'>{student.parentsNumber}</td>
                                    <td className='d-none d-md-table-cell'>{student.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    )}
            </table>
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