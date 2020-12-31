import Layout from "../components/layout";
import React, {useEffect, useState} from 'react'
import {queryParam} from "../services/requestService";
import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, Row} from "reactstrap";
import StudentModal from "../components/modals/studentModal";


import GroupModal from "../components/modals/groupModal";
import PaymentModal from "../components/modals/paymentModal";
import {confirmAlertService} from "../services/confirmAlert";

export default function Students() {
    const [loading, setLoading] = useState(true)

    const [groups, setGroups] = useState([])
    const [groupModal, setGroupModal] = useState(false)
    const [group, setGroup] = useState({subject:{}, teachers:[]})
    const [isPresent, setPresent] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    const [student, setStudent] = useState()
    const [openedCollapse, setOpenedCollapse] = React.useState("")

    useEffect(() => {
        let isMounted = true;
        setLoading(true)
        requestGroups(true)
        setPresent(!isPresent)
        return () => { isMounted = false };
    }, [])

    const requestGroups = (isPresent) => {
        queryParam({path: "/api/groups/with-s-balance", method: "get", isPresent: isPresent}).then(res => {
            if(res.data.success) {
                setGroups(res.data.object)
            } else {
                alert(res.data.message)
            }
            setLoading(false)
        })
    }

    const changePage = () =>{
        setLoading(true)
        setPresent(!isPresent)
        requestGroups(!isPresent)
    }

    const openGroupModal = (group) => {
        setGroupModal(true);
        setGroup(group)
    };

    const onEditGroup = (groupIndex) => {
        const chosenGroup = groups[groupIndex]
        openGroupModal(chosenGroup)
    };

    const onDelete = (group) => {
        confirmAlertService('Guruh', group.name, deleteGroup, group.id, isPresent)
    };

    const deleteGroup = async (groupId) => {
        await queryParam({
            path: '/api/groups/closeOrReopen',
            method: 'patch',
            groupId
        });
        requestGroups(isPresent)
    };

    const [studentModal, setStudentModal] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState('')

    const openStudentModal = (groupId) => {
        setSelectedGroupId(groupId)
        setStudentModal(true)
    }

    const openPaymentModal = (selectedStudent, group) => {
        setStudent({groupId: group.id, ...selectedStudent})
        console.log(group)
        setGroup(group)
        togglePaymentModal()
    }
    const togglePaymentModal = () => {
        setPaymentModal(!paymentModal)
    }

    return (
        <Layout loading={loading} title={'Studentlar'}>
            <Container>
                <Row>
                    <Col className='text-center pt-2'>
                        <Button
                            disabled={loading}
                            className='mb-1 text-white'
                            color={isPresent ? 'warning' : 'info'}
                            onClick={changePage}>{isPresent ? 'Deleted' : 'Present'}
                        </Button>
                        <br/>
                        <Button disabled={!isPresent} color={'success'} onClick={()=>openGroupModal({})}>
                            Guruh qo`shish
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className='p-0' md='12'>
                        <div className=" accordion my-3" id="accordionExample">
                            {groups && groups.map((group, index) =>
                                <Card key={index}>
                                    <CardHeader
                                        className='p-0'
                                        id={index}
                                        aria-expanded={openedCollapse === group.id}
                                    >
                                        <div className="mb-0 position-relative">
                                            <Button
                                                onClick={() =>
                                                    setOpenedCollapse(
                                                        openedCollapse === group.id
                                                            ? ""
                                                            : group.id
                                                    )
                                                }
                                                className='font-weight-bold text-decoration-none w-100 text-monospace text-uppercase'
                                                color="link"
                                            >
                                                <span className={isPresent?'':'text-danger'}>{group.name}</span>
                                            </Button>
                                            <button onClick={() => onEditGroup(index)} color={''}
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
                                        isOpen={openedCollapse === group.id}
                                        aria-labelledby={index}
                                        data-parent="#accordionExample"
                                        id={group.id}
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
                                                                className='badge badge-primary p-1'><strong>+</strong>
                                                        </button>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>{
                                                    group.students && (group.students.length > 0 ?
                                                        group.students.map((student, i) => (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>{student.lastName + " " + student.firstName}</td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => openPaymentModal(student, group)}
                                                                        className={(student.balance >= 0 ? 'btn btn-success' : 'btn btn-danger')}>
                                                                        {student.balance.toLocaleString()}
                                                                    </button>
                                                                </td>
                                                                <td>{student.phoneNumber}</td>
                                                                <td className='d-none d-md-table-cell'>{student.parentsNumber}</td>
                                                                <td className='d-none d-md-table-cell'>{student.address}</td>
                                                            </tr>
                                                        )) :
                                                        <tr>
                                                            <td colSpan='15' className='text-center m-0 p-2'>
                                                                Bu guruhga o`quvchi qo`shilmagan
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

            {groupModal === true && <GroupModal
                isOpen={groupModal}
                setOpen={setGroupModal}
                refresh={requestGroups}
                group={group}
            />}

            {studentModal === true && <StudentModal
                isOpen={studentModal}
                setOpen={setStudentModal}
                payload={selectedGroupId}
                refresh={requestGroups}
            />}

            {paymentModal === true && <PaymentModal
                isOpen={paymentModal}
                setOpen={setPaymentModal}
                payload={{group, student}}
                refresh={requestGroups}
            />}
        </Layout>
    )
}