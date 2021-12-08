import Layout from "../components/layout";
import React, {useEffect, useState} from 'react'
import {logout, queryParam} from "../services/requestService";
import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, Row} from "reactstrap";
import StudentModal from "../components/modals/studentModal";


import GroupModal from "../components/modals/groupModal";
import PaymentModal from "../components/modals/paymentModal";
import {confirmAlertService} from "../services/confirmAlert";
import EditButton from "../components/buttons/editButton";
import DeleteButton from "../components/buttons/deleteButton";
import AddButton from "../components/buttons/addButton";
import AbstractModal from "../components/modals/abstractModal";

export default function Students() {
    const [loading, setLoading] = useState(true)

    const [groups, setGroups] = useState([])
    const [groupModal, setGroupModal] = useState(false)
    const [group, setGroup] = useState({subject: {}, teachers: []})
    const [isPresent, setPresent] = useState(true)
    const [paymentModal, setPaymentModal] = useState(false)
    const [openedCollapse, setOpenedCollapse] = useState("")

    useEffect(() => {
        let isMounted = true;
        setLoading(true)
        requestGroups(true)
        return () => {
            isMounted = false
        };
    }, [])

    const requestGroups = (isPresent) => {
        queryParam({path: "/api/groups/with-s-balance", method: "get", isPresent: isPresent}).then(res => {
            if (res.data.success) {
                setGroups(res.data.object)
            } else {
                alert(res.data.message)
                logout()
            }
            setLoading(false)
        })
    }

    const changePage = () => {
        setLoading(true)
        setPresent(!isPresent)
        requestGroups(!isPresent)
    }

    const openGroupModal = (group) => {
        setGroup(group)
        setGroupModal(true);
    };

    const onEditGroup = (chosenGroup) => {
        openGroupModal(chosenGroup)
    };

    const onCloseGroup = (group) => {
        confirmAlertService('Guruh', group.name, closeGroup, group.id, isPresent, true)
    };

    const closeGroup = (groupId) => {
        setLoading(true)
        queryParam({
            path: '/api/groups/closeOrReopen',
            method: 'patch',
            groupId
        }).then(res => requestGroups(isPresent))
    };

    const onDeleteGroup = (group) => {
        confirmAlertService('Guruh', group.name, deleteGroup, group.id, isPresent, false)
    }

    const deleteGroup = (groupId) => {
        setLoading(true)
        queryParam({
            path: '/api/groups',
            method: 'delete',
            groupId
        }).then(res => requestGroups(false))
    };

    const [studentModal, setStudentModal] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState('')
    const [student, setStudent] = useState({})
    const [isEditStudentModal, setEditStudentModal] = useState(false)

    const openStudentModal = () => {
        setStudentModal(true)
    }

    const createStudent = (groupId) => {
        setStudent({})
        setSelectedGroupId(groupId)
        setEditStudentModal(false)
        openStudentModal()
    }

    const onEditStudent = (selectedStudent) => {
        setEditStudentModal(true)
        setSelectedGroupId(null)
        setStudent(selectedStudent)
        openStudentModal()
    }

    const onDeleteStudentFromGroup = (student, groupId) => {
        confirmAlertService('Student', student.lastName + ' ' + student.firstName, deleteStudentFromGroup, {
            studentId: student.id,
            groupId
        }, true, true)
    };
    const deleteStudentFromGroup = async (params) => {
        await queryParam({
            path: '/api/student/delete-from-group',
            method: 'patch',
            ...params
        });
        requestGroups(isPresent)
    }

    const onDeleteStudent = (studentId) => {
        confirmAlertService('Student', student.lastName + ' ' + student.firstName, deleteStudent, studentId, true, false)
    };

    const deleteStudent = (studentId) => {
        queryParam({
            path: '/api/student',
            method: 'delete',
            studentId
        }).then(res => requestGroups(false))
    }

    const openPaymentModal = (selectedStudent, group) => {
        setStudent({groupId: group.id, ...selectedStudent})
        setGroup(group)
        togglePaymentModal()
    }

    const togglePaymentModal = () => {
        setPaymentModal(!paymentModal)
    }

    const [isTestResultsOpen, setTestResultsOpen] = useState(false)
    const [testResults, setTestResults] = useState([{resTestResults:[]}])
    const getTestResultsByGroupId = (groupId) => {
        queryParam({
            path: '/api/student-history/get-results/' + groupId,
            method: 'get'
        }).then(res => {
            setTestResultsOpen(true)
            setTestResults(res.data.object)
            console.log(res)
        })
    }

    return (
        <Layout loading={loading} title={'Studentlar'}>
            <Container>
                <Row>
                    <Col className='text-right pt-3 px-0'>
                        <Button disabled={!isPresent} color={'success'} onClick={() => openGroupModal({})}>
                            Guruh qo`shish
                        </Button>
                        <Button
                            disabled={loading}
                            className='ml-1 ml-md-2 text-white'
                            color={isPresent ? 'warning' : 'info'}
                            onClick={changePage}>{isPresent ? 'Deleted' : 'Present'}
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
                                                <span className={isPresent ? '' : 'text-danger'}>{group.name}</span>
                                            </Button>

                                            <DeleteButton submit={() => onCloseGroup(group)} isDelete={!isPresent}
                                                          style={{
                                                              zIndex: '1',
                                                              left: '5px',
                                                              top: '6px',
                                                              bottom: '6px',
                                                              position: 'absolute',
                                                          }}/>

                                            <DeleteButton disableBtn={false}
                                                          style={{
                                                              display: isPresent ? 'none' : 'inline-block',
                                                              padding: '0!important',
                                                              marginRight: '10px',
                                                              zIndex: '1',
                                                              right: '25px',
                                                              top: '6px',
                                                              bottom: '6px',
                                                              position: 'absolute',
                                                          }}
                                                          size={'25px'}
                                                          submit={() => onDeleteGroup(group)} isDelete={true}/>

                                            <EditButton submit={() => onEditGroup(group)}
                                                        style={{
                                                            zIndex: '1',
                                                            right: '5px',
                                                            bottom: 0,
                                                            top: 0,
                                                            position: 'absolute'
                                                        }}/>
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
                                                    <th><AddButton
                                                        style={{width: '35px'}}
                                                        submit={() => createStudent(group.id)}/>
                                                        <Button onClick={() => getTestResultsByGroupId(group.id)}>Test
                                                            Results</Button>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>{
                                                    group.students && (group.students.length > 0 ?
                                                        group.students.map((student, i) => (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <button
                                                                        className='btn text-white shadow-none bg-transparent'
                                                                        onClick={() => onEditStudent(student)}
                                                                    >
                                                                        {student.lastName + " " + student.firstName}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => openPaymentModal(student, group)}
                                                                        className={(student.balance >= 0 ? 'btn btn-success' : 'btn btn-danger')}>
                                                                        {/*{console.log(student)}*/}
                                                                        {/*{student.balance}*/}
                                                                        {student.balance != null ? student.balance.toLocaleString() : 0}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <DeleteButton
                                                                        submit={() => onDeleteStudent(student.id)}
                                                                        // isStudyingNow
                                                                        size='25px' style={{
                                                                        display: true ? 'none' : 'inline-block',
                                                                        marginRight: '10px'
                                                                    }} disableBtn={false}/>
                                                                    {/*<EditButton submit={() => onEditStudent(student)}*/}
                                                                    {/*            size='25px'/>*/}
                                                                    <DeleteButton
                                                                        submit={() => onDeleteStudentFromGroup(student, group.id)}
                                                                        size='25px' style={{marginLeft: '10px'}}/>
                                                                </td>
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
                payload={{selectedGroupId, student}}
                refresh={requestGroups}
                openPaymentModal={openPaymentModal}
                isEdit={isEditStudentModal}
                setEdit={setEditStudentModal}
            />}

            {paymentModal === true && <PaymentModal
                isOpen={paymentModal}
                setOpen={setPaymentModal}
                payload={{group, student}}
                refresh={requestGroups}
            />}

            {isTestResultsOpen === true && <AbstractModal
                header={'Test natijalari'}
                isOpen={isTestResultsOpen}
                submit={()=>{setTestResultsOpen(!isTestResultsOpen)}}
                setOpen={setTestResultsOpen}
                children={<table className='table m-0 table-bordered'>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>FIO</th>
                        {
                            testResults[0].resTestResults.map(res=>(
                                <th key={res.testTitle}>{res.testTitle}</th>
                            ))
                        }
                    </tr>
                    </thead>
                    <tbody>{
                            testResults.map((testResult, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                        {testResult.studentLastName + " " + testResult.studentFirstName}
                                    </td>
                                    {
                                        testResults[i].resTestResults.map(res=>(
                                            <td key={i}>{res.result}</td>
                                        ))
                                    }
                                </tr>
                            ))
                    }</tbody>
                </table>}/>}
        </Layout>
    )
}