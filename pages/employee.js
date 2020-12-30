import Layout from "../components/layout";
import Head from "next/head";

import {queryData, queryParam} from "../services/requestService";
import {Button, FormGroup, Input, Modal, ModalBody, ModalHeader} from "reactstrap";
import React, {useEffect, useState} from 'react'

export default function Employee() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([{roles: [{name: ""}]}])
    const [singleUser, setUser] = useState({id: null})
    const [modal, setModal] = useState(false)
    const [isDeletedEmployeePage, setDeletedEmployeePage] = useState(true)
    const [directorId, setDirectorId] = useState('')

    useEffect(() => {
        requestEmployeeList().then(r => {
            setDeletedEmployeePage(false)
            checkIfDirector(r)
            setLoading(false)
        })
    }, [])

    const requestEmployeeList = async () => {
        const res = await queryParam({path: '/api/user', method: 'get', isEnabled: isDeletedEmployeePage})
        setUsers(res.data.object)
        setDeletedEmployeePage(!isDeletedEmployeePage)
        return res.data.object
    }

    const checkIfDirector = (users) => {
        for (let user of users) {
            for (let role of user.roles) {
                if (role.name === "DIRECTOR") {
                    setDirectorId(user.id)
                }
            }
        }
    }

    const toggleModal = () => setModal(!modal);

    const onSave = async () => {
        const newUser = {
            id: singleUser.id,
            firstName: document.getElementsByName('firstName')[0].value,
            lastName: document.getElementsByName('lastName')[0].value,
            phoneNumber: document.getElementsByName('phoneNumber')[0].value,
        };
        setUser({});
        await queryData({
            path: '/api/user',
            method: 'post',
            ...newUser
        });
        await requestEmployeeList()
        toggleModal()
    };

    const onEdit = (index) => {
        setUser(users[index])
        toggleModal()
    };

    const onDelete = async (userId) => {
        await queryParam({
            path: '/api/user/disable',
            method: 'patch',
            userId: userId
        }).catch(error=>console.log(error))
        await requestEmployeeList()
    };


    return (
        <Layout loading={loading}>
            <Head>
                <title>Ishchilar</title>
            </Head>
            <div className="table-responsive">
                <table className="table table-info table-hover text-primary text-center mb-0">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>FIO</th>
                        <th>Tel</th>
                        <th>Kasb</th>
                        <th><Button disabled={isDeletedEmployeePage} onClick={toggleModal} color={'success'}
                                    style={{width: '90px'}}>
                            {/*<i className='fa fa-user-plus'> </i>*/}
                            Add +
                        </Button>
                            <Button
                                style={{width: '90px'}}
                                className='ml-md-1 mt-1 mt-md-0 text-white'
                                color={!isDeletedEmployeePage ? 'warning' : 'info'}
                                onClick={requestEmployeeList}>
                                {!isDeletedEmployeePage ? 'Deleted' : 'Present'}
                            </Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((user, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    {/*<Link className="list-group-item-action"*/}
                                    {/*      to={{pathname: '/groups', state: {teacherId: user.id}}}>*/}
                                    {/*    <p className="bg-info text-white rounded shadow py-1 m-0">*/}
                                    {user.firstName + ' ' + user.lastName}
                                    {/*</p>*/}
                                    {/*</Link>*/}
                                    {/*<Route path="/groups" component={Groups}/>*/}
                                </td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.roles.length > 0 && user.roles[0].name}</td>
                                <td>
                                    <Button className='mr-2' color={'info'} onClick={() => onEdit(index)}>
                                        <i className='fa fa-edit'> </i>
                                        edit
                                    </Button>
                                    <Button disabled={user.id===directorId}
                                            color={!isDeletedEmployeePage ? 'danger' : 'primary'}
                                            onClick={() => onDelete(user.id)}>
                                        {/*<i className='fa fa-trash'> </i>*/}
                                        {!isDeletedEmployeePage ? 'delete' : 'repair'}
                                    </Button>
                                </td>
                            </tr>
                        )
                    }
                    <tr>
                        <td colSpan={10}>For programmers</td>
                    </tr>
                    </tbody>
                </table>

                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal} className="bg-info text-white">Yangi foydalanuvchi
                        qo`shish</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Input type="text" defaultValue={singleUser.firstName} name="firstName"
                                   placeholder="Ism"/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" defaultValue={singleUser.lastName} name="lastName"
                                   placeholder="Familiya"/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" name="phoneNumber" defaultValue={singleUser.phoneNumber}
                                   placeholder="Telefon raqami"/>
                        </FormGroup>
                        <FormGroup className="text-right">
                            <Button type="submit" color="success" onClick={onSave}>Saqlash</Button>
                        </FormGroup>
                    </ModalBody>
                </Modal>
            </div>
        </Layout>
    )
}
