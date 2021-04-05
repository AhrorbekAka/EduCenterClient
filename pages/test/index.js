import React, {useEffect, useState} from 'react'
import Layout from "../../components/layout";
import {queryParam} from "../../services/requestService";
import {Button, Input, InputGroup, InputGroupAddon, Label} from 'reactstrap';

import {store} from "../../services/store";
import {useRouter} from "next/router";
import Link from "next/link";
import SubmitButton from "../../components/buttons/submitButton";

export default function TestIndex() {
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [testList, setTestList] = useState([])
    const [groups, setGroups] = useState([])
    const [studentPhoneNumber, setStudentPhoneNumber] = useState('+998')
    const [phoneNumDisabled, setPhoneNumDisabled] = useState(false)


    useEffect(() => {
        const props = store({payload: '', action: 'getProps'})
        if (props.phoneNumber !== undefined) {
            setStudentPhoneNumber(props.phoneNumber)
            setGroups(props.groups)
            setTestList(props.testList)
        }
        setLoading(false)
    }, [])

    const requestGroupsByStudentPhoneNumber = () => {
        setBtnLoading(true)
        const phoneNumber = document.getElementsByName('phoneNumber')[0].value
        queryParam({
            path: '/api/groups/for-student/' + phoneNumber,
            method: 'get'
        }).then(res => {
            setGroups(res.data.object)
            setStudentPhoneNumber(phoneNumber)
            setPhoneNumDisabled(true)
        }).catch(() => {
            setStudentPhoneNumber('+998')
            document.getElementsByName('phoneNumber')[0].value = '+998'
            alert('Bu raqam ro`yhatdan o`tkazilmagan ! ! !')
        }).finally(() => setBtnLoading(false));
    }

    const onSelectGroup = () => {
        setLoading(true)
        queryParam({
            path: '/api/test/by-group/' + document.getElementsByName('group')[0].value,
            method: 'get'
        }).then(res => {
            setTestList(res.data.object)
        }).catch(() => {
            alert('Test topilmadi ! ! !')
            document.getElementsByName('group')[0].value = '-1'
        }).finally(() => setLoading(false));
    }

    const router = useRouter();

    const startTest = (test) => {
        setLoading(true)
        store({payload: {phoneNumber: studentPhoneNumber, ...test}, action: 'setTest'})
        store({payload: {phoneNumber: studentPhoneNumber, groups, testList, ...test}, action: 'setProps'})
        router.push('/test/test').then()
    }

    const onHome = () => {
        store({payload:{}, action: 'setTest'})
        store({payload:{}, action: 'setProps'})
    }

    return (
        <div style={{
            color: '#fff !important',
            minHeight: '100vh',
            paddingBottom: '1rem',
            // background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'
            background: 'linear-gradient(#02aab0, #00cdac)'
        }}>
            <Layout home loading={loading}>
                <div className='container'>
                    <div className='pt-5 text-center'>
                        <div className='mb-3 text-white'>
                            <Link href='/'>
                                <a onClick={onHome} className='btn btn-primary btn-sm'>
                                    Home
                                </a>
                            </Link>
                        </div>
                        <Label className='mr-3 text-md-left text-white'>
                            <p>Telefon №</p>
                            <InputGroup>
                                <Input type="text" name="phoneNumber" disabled={phoneNumDisabled}
                                       defaultValue={studentPhoneNumber}
                                       placeholder="Telefon raqamingizni kiriting"/>
                                <InputGroupAddon addonType="append">
                                    {/*<Button color={'success'} name="phoneNumber" disabled={phoneNumDisabled}*/}
                                    {/*        onClick={requestGroupsByStudentPhoneNumber}>Submit</Button>*/}
                                    <SubmitButton
                                        submit={requestGroupsByStudentPhoneNumber}
                                        disabled={phoneNumDisabled}
                                        loading={btnLoading}
                                        className={btnLoading ? 'px-4' : ''}
                                        name="phoneNumber"/>
                                </InputGroupAddon>
                            </InputGroup>
                        </Label>
                        <Label>
                            <p className={groups.length > 0 ? 'text-light' : 'text-warning'}>{groups.length > 0 ? 'Guruhingizni tanlang' : 'Guruh tanlashdan avval fan tanlang'}</p>
                            <Input type="select" name="group" defaultValue='-1' onChange={onSelectGroup}>
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