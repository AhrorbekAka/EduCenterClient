import * as React from 'react'

import 'katex/dist/katex.min.css'
import Latex from 'react-latex'
import Layout from "../../components/layout";
import {Button, FormGroup, Input, Label} from "reactstrap";
import Image from "next/image";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import {useEffect, useState} from "react";
import {queryData, queryParam} from "../../services/requestService";
import {store} from "../../services/store";
import {useRouter} from "next/router";

const LaTeX = 'We give illustrations for the three processes $alfa^+e^-$, gluon-gluon and $\\alfa\\gamma \\to W t\\bar b$.'

export default function Test() {
    const [loading, setLoading] = useState(false)
    const [test, setTest] = useState({})
    const [questions, setQuestions] = useState([])
    const [resAnswerList, setResAnswerList] = useState([])
    const [isTestDisabled, setTestDisabled] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const answerIdList = useState([])

    useEffect(() => {
        const test = store({payload: '', action: 'getTest'})
        setTest(test)
        queryParam({path: '/api/question/by-test/'+test.id}).then(res=>{
            if(res.status === 200) {
                setQuestions(res.data.object)
            }
        })
        setLoading(false)
    }, [])

    const router = useRouter()

    const back = () => {
        setTest({})
        setQuestions([])
        router.push('/test')
    }

    const onSelectAnswer = (questionIndex, answerId, e) => {
        answerIdList[questionIndex] = answerId
    }

    const onCheck = () => {
        if (answerIdList.length === questions.length) {
            setLoading(true)
            queryData({
                path: '/api/test/check/' + test.phoneNumber + '/' + test.id,
                method: 'patch',
                idList: answerIdList
            }).then(res => {
                setTestDisabled(true)
                setResAnswerList(res.data.object)
                setModalOpen(true)
                setLoading(false)
            })
        }
    }

    return (
        <Layout home loading={loading}>
            <div className='container'>
                <div className='text-right container mt-3'>
                    <button onClick={back} className='btn btn-outline-primary py-1'>{'<- ortga'}</button>
                </div>
                <div>
                    <h3 className='text-center'>{test.title}</h3>
                    {questions.map((question, index) =>
                        <FormGroup className='border-bottom border-secondary p-2' tag="fieldset" key={index}>
                            <legend key={index} className=' rounded border-dark px-2'>
                                    <span className='mr-md-4'>
                                        {(index + 1) + '. '}
                                    </span>
                                <Latex strict delimiters={[
                                    {left: '$$', right: '$$', display: true},
                                    {left: '\\(', right: '\\)', display: false},
                                    {left: '$', right: '$', display: false},
                                    {left: '\\[', right: '\\]', display: true},
                                ]}>{question.question}</Latex>
                            </legend>
                            {question.answers.map((answer, i) =>
                                <FormGroup check key={i}
                                           className={'border rounded mb-1 border-' + (i === 0 ? 'primary' : i === 1 ? 'warning' : i === 2 ? 'info' : 'danger')}>
                                    {
                                        resAnswerList.map(resAnswer =>
                                            resAnswer === answer.id ?
                                                <div key={resAnswer} style={{
                                                    zIndex: '1',
                                                    right: '5px',
                                                    top: '2px',
                                                    position: 'absolute'
                                                }}>
                                                    <Image
                                                        src="/check.png"
                                                        alt="tick +"
                                                        width={'20px'}
                                                        height={'20px'}
                                                    /></div> : ''
                                        )
                                    }
                                    <Label onClick={(event) => onSelectAnswer(index, answer.id, event)} key={i} check
                                           className='mx-1'>
                                        <Input disabled={isTestDisabled} type="radio" name={question.question}/>
                                        {' ' + (i === 0 ? 'A' : i === 1 ? 'B' : i === 2 ? 'C' : 'D') + ')  '}
                                        <Latex strict>{answer.answer}</Latex>
                                    </Label>
                                </FormGroup>
                            )}
                        </FormGroup>
                    )}
                    <Button
                        onClick={!isTestDisabled ? onCheck : back}>
                        {!isTestDisabled ? 'Testni yakunlash' : 'Chiqish'}
                    </Button>

                    <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} unmountOnClose={true}>
                        <ModalBody>
                            <h3
                                className={resAnswerList.length > 22 ? 'text-success' : (resAnswerList.length > 15 ? 'text-warning' : 'text-danger') + ' text-center'}>
                                {resAnswerList.length}<i> ta to`g`ri javob</i>
                            </h3>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        </Layout>
    )
}