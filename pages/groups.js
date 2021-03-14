import Layout from "../components/layout";
import React, {useEffect, useState} from 'react'

import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, Row,} from "reactstrap";
import {queryData} from "../services/requestService";
import StudentModal from "../components/modals/studentModal";
import AddButton from "../components/buttons/addButton";

export default function Groups() {
    const [loading, setLoading] = useState(true)
    const [openedCollapse, setOpenedCollapse] = React.useState('')

    const [groupList, setGroupList] = useState([])

    const [studentModal, setStudentModal] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState('')

    const [attendanceList, setAttendanceList] = useState([])

    useEffect(async () => {
        console.log(new Date())
        const a = await requestGroupList()
        asd(a)
    }, [])

    function asd(a){
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();

        let newDate = year + "/" + month + "/" + day;
        console.log(a[0].students[0].attendaces[0].createdAt);
    }

    const requestGroupList = async() => {
        const res = await queryData({path: '/api/groups', method: 'get'})
        setGroupList(res.data.object)
        console.log(res.data.object)
        setLoading(false)
        return res.data.object
    }

    const onAttendanceClick = () => {

    }

    const onAttendanceDoubleClick = () => {

    }

    return (
        <Layout loading={loading} title={'Guruhlar'}>
            <div className=" accordion-1">
                <Container>
                    <Row><Col className='p-0' md='12'>
                        <div className=" accordion my-3" id="accordionCollapse">
                            {groupList.length > 0 ? groupList.map((group, index) =>
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
                                                    {group.name}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <Collapse
                                            isOpen={openedCollapse === group.id}
                                            aria-labelledby={index}
                                            data-parent="#accordionCollapse"
                                            id={group.id.toString()}
                                        >
                                            <CardBody className="opacity-8 p-0 table-responsive ">
                                                <table className='table table-dark m-0'>
                                                    <thead>
                                                    <tr>
                                                        <th>№</th>
                                                        <th>FIO</th>
                                                        {!group.students[0].attendances.length > 0 ?
                                                            <th></th> : group.students[0].attendances.map((attendance, i) =>
                                                                <th key={i}>{attendance.createdAt}</th>
                                                            )}
                                                        <th>Bugungi</th>
                                                        <th className='pb-2'>
                                                            <AddButton size={'18px'} style={{width: '40px'}}
                                                                       submit={() => {
                                                                           setStudentModal(true)
                                                                           setSelectedGroupId(group.id)
                                                                       }}/>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>{
                                                        group.students.length > 0 ?
                                                            group.students.map((student, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{student.lastName + " " + student.firstName}</td>
                                                                    {!student.attendances.length > 0 ?
                                                                        <td> </td> : student.attendances.map(attendance =>
                                                                            <td>
                                                                                <span className={'border border-primary '+(
                                                                                    attendance.absent && attendance.excusable ?
                                                                                        'bg-warning border-warning' : attendance.absent ?
                                                                                        'bg-danger border-danger' : 'bg-primary border-primary')
                                                                                }
                                                                                     style={{
                                                                                         padding: '8px',
                                                                                         borderRadius:'3px',
                                                                                         display:'inline-block',
                                                                                         verticalAlign: 'middle'
                                                                                     }}
                                                                                />
                                                                            </td>)}
                                                                    <td>
                                                                        <button onClick={onAttendanceClick}
                                                                                onDoubleClick={onAttendanceDoubleClick}
                                                                                className='btn btn-primary'
                                                                                style={{
                                                                                    padding:'8px'
                                                                                }}/>
                                                                    </td>
                                                                </tr>
                                                            )) :
                                                            <tr>
                                                                <td colSpan='4' className='text-center m-0 p-2'>
                                                                    Bu guruhga o`quvchi qo`shilmagan
                                                                </td>
                                                            </tr>
                                                    }</tbody>
                                                </table>
                                            </CardBody>
                                        </Collapse>
                                    </Card>) :
                                <h4 className='text-warning text-center'>Sizga guruh biriktirilmagan. Sayt egasiga
                                    murojat qiling</h4>}
                        </div>
                    </Col>
                    </Row>
                </Container>
            </div>


            {studentModal === true && <StudentModal
                isOpen={studentModal}
                setOpen={setStudentModal}
                payload={{selectedGroupId}}
                refresh={requestGroupList}
            />}

        </Layout>
    )
}