import React, {useState, useEffect} from 'react'
import Layout from "../../components/layout";
import {queryParam} from "../../services/requestService";
import {Button, FormGroup, Label, Input, InputGroupAddon, InputGroup} from 'reactstrap';

import {store} from "../../services/store";
import {useRouter} from "next/router";
import Link from "next/link";

export default function TestIndex() {
    const [loading, setLoading] = useState(true)
    const [testList, setTestList] = useState([])
    const [groups, setGroups] = useState([])
    const [studentPhoneNumber, setStudentPhoneNumber] = useState([])


    useEffect(() => {
        const props = store({payload: '', action: 'getProps'})
        if (props.phoneNumber !== undefined) {
            setStudentPhoneNumber(props.phoneNumber)
        }
        setLoading(false)
    }, [])


    const requestGroupsByStudentPhoneNumber = () => {
        document.getElementsByName('phoneNumber')[0].disabled = true
        document.getElementsByName('phoneNumber')[1].disabled = true
        const phoneNumber = document.getElementsByName('phoneNumber')[0].value
        setStudentPhoneNumber(phoneNumber)
        queryParam({
            path: '/api/groups/for-student/' + phoneNumber,
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                setGroups(response.data.object)
            }
        }).catch(res => {
            alert('Bu raqam ro`yhatdan o`tkazilmagan ! ! !')
            document.getElementsByName('phoneNumber')[0].value = '+998'
            document.getElementsByName('phoneNumber')[0].disabled = false
            document.getElementsByName('phoneNumber')[1].disabled = false
        });
    }

    const requestTest = (subject) => {
        setLoading(true)
        queryParam({path: '/api/test/' + subject, method: 'get'}).then(res => {
            setTestList(res.data.object)
            setLoading(false)
        })
    }

    const selectGroup = () => {
        queryParam({
            path: '/api/test/by-group/' + document.getElementsByName('group')[0].value,
            method: 'get'
        }).then(res => {
            if (res.status === 200) {
                setTestList(res.data.object)
            }
        }).catch(res => {
            console.log(res)
            alert('Test topilmadi ! ! !')
            document.getElementsByName('group')[0].value = '-1'
            document.getElementsByName('group')[0].disabled = false
        });
    }

    const router = useRouter();

    const startTest = (test) => {
        setLoading(true)
        store({payload: {phoneNumber: studentPhoneNumber, ...test}, action: 'setTest'})
        store({payload: {phoneNumber: studentPhoneNumber, ...test}, action: 'setProps'})
        router.push('/test/test').then()
    }

    return (
        <div style={{
            color: '#fff !important',
            height: '100vh',
            background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'
        }}>
            <Layout home loading={loading}>
                <div className='container'>
                    <div className='pt-5 text-center'>
                        <div className='mb-3'>
                            <Link href='/'>
                                <a>
                                    Home
                                </a>
                            </Link>
                        </div>
                        <Label className='mr-3 text-md-left'>
                            <p>Telefon №</p>
                            <InputGroup>
                                <Input type="text" name="phoneNumber" defaultValue='+998'
                                       placeholder="Telefon raqamingizni kiriting"/>
                                <InputGroupAddon addonType="append">
                                    <Button color={'success'} name="phoneNumber"
                                            onClick={requestGroupsByStudentPhoneNumber}>Submit</Button></InputGroupAddon>
                            </InputGroup>
                        </Label>
                        <Label>
                            <p className={groups.length > 0 ? 'text-success' : 'text-warning'}>{groups.length > 0 ? 'Guruhingizni tanlang' : 'Guruh tanlashdan avval fan tanlang'}</p>
                            <Input type="select" name="group" defaultValue='-1' onChange={selectGroup}>
                                {<>
                                    <option value='-1' disabled>Guruhingizni tanlang</option>
                                    {groups.map((group, index) =>
                                        <option key={index} value={group.id}>{group.name}</option>)}
                                </>}

                            </Input>
                        </Label>
                    </div>
                    <ul className='list-group text-dark'>
                        {testList.map(test =>
                            <div key={test.id}>
                                <li className='list-group-item'>
                                    <div className="row">
                                        <h4 className='text-left col-7 col-md-10 pr-0 font-weight-light'>{test.title}</h4>
                                        <div className='text-right col-5 col-md-2 p-0'>
                                            <button className='btn btn-outline-secondary px-1 px-md-3'
                                                    onClick={() => startTest(test)}>
                                                Testni boshlash
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>
            </Layout>
        </div>
    )
}