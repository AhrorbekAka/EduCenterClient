import Layout from "../components/layout";
import React, {useEffect, useState} from 'react'

import {Button, Card, CardBody, CardHeader, Col, Collapse, Container, Row,} from "reactstrap";
import {queryData} from "../services/requestService";
import StudentModal from "../components/modals/studentModal";

export default function Groups() {
    const [loading, setLoading] = useState(true)
    const [openedCollapse, setOpenedCollapse] = React.useState('')

    const [groupList, setGroupList] = useState([])

    const [studentModal, setStudentModal] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState('')

    useEffect(() => {
        requestGroupList()
    }, [])

    const requestGroupList = () => {
        queryData({path: '/api/groups', method: 'get'}).then(res => {
            setGroupList(res.data.object)
            setLoading(false)
        })

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
                                                        <th>Telefon №</th>
                                                        <th>
                                                            <button onClick={() => {
                                                                setStudentModal(true)
                                                                setSelectedGroupId(group.id)
                                                            }} className='badge badge-primary'><strong>+</strong>
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