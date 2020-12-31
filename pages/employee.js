import Layout from "../components/layout";

import {queryParam} from "../services/requestService";
import {Button} from "reactstrap";
import React, {useEffect, useState} from 'react'
import EmployeeModal from "../components/modals/employeeModal";
import {confirmAlertService} from "../services/confirmAlert";

export default function Employee() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([{roles: [{name: ""}]}])
    const [user, setUser] = useState({id: null})
    const [modal, setModal] = useState(false)
    const [isDeletedPage, setDeletedPage] = useState(false)
    const [directorId, setDirectorId] = useState('')

    useEffect(() => {
        requestEmployeeList(true).then(r => {
            checkIfDirector(r)
            setLoading(false)
        })
    }, [])

    const requestEmployeeList = async (isEnabled) => {
        const res = await queryParam({path: '/api/user', method: 'get', isEnabled})
        setUsers(res.data.object)
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

    const changePage = () => {
        setDeletedPage(!isDeletedPage)
        requestEmployeeList(isDeletedPage)
    }

    const openModal = () => setModal(true);

    const onEdit = (user) => {
        setUser(user)
        openModal()
    };

    const onDelete = (user) => {
       confirmAlertService('Foydalanuvchi', user.firstName+' '+user.lastName, deleteEmployee, user.id, !isDeletedPage)
    };

    const deleteEmployee=async (userId)=>{
        await queryParam({
            path: '/api/user/disable',
            method: 'patch',
            userId: userId
        }).then(res=>requestEmployeeList(!isDeletedPage))
            .catch(error => console.log(error))
    }

    return (
        <Layout loading={loading} title={'Ishchilar'}>
            <div className="table-responsive">
                <table className="table table-info table-hover text-primary text-center mb-0">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>FIO</th>
                        <th>Tel</th>
                        <th>Kasb</th>
                        <th>
                            <Button disabled={isDeletedPage} onClick={openModal} color={'success'}
                                    style={{width: '90px'}}>
                                {/*<i className='fa fa-user-plus'> </i>*/}
                                Add +
                            </Button>
                            <Button
                                style={{width: '90px'}}
                                className='ml-md-1 mt-1 mt-md-0 text-white'
                                color={isDeletedPage ? 'info' : 'warning'}
                                onClick={changePage}>
                                {isDeletedPage ? 'Present' : 'Deleted'}
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
                                    <Button className='mr-2' color={'info'} onClick={() => onEdit(user)}>
                                        <i className='fa fa-edit'> </i>
                                        edit
                                    </Button>
                                    <Button disabled={user.id === directorId}
                                            color={!isDeletedPage ? 'danger' : 'primary'}
                                            onClick={() => onDelete(user)}>
                                        {/*<i className='fa fa-trash'> </i>*/}
                                        {!isDeletedPage ? 'delete' : 'repair'}
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

                {modal&&<EmployeeModal
                    isOpen={modal}
                    setOpen={setModal}
                    user={user}
                    refresh={requestEmployeeList}
                />}
            </div>
        </Layout>
    )
}
