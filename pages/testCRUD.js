import {useState, useEffect} from 'react';
import Layout from "../components/layout";
import {InputGroupText, Button, FormGroup, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import {queryData, queryParam} from "../services/requestService";

import 'katex/dist/katex.min.css'
import Latex from "react-latex";
import * as React from "react";

export default function TestCrud() {
    const [loading, setLoading] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [subjectName, setSubjectName] = useState()
    const [groups, setGroups] = useState([])
    const [selectedGroupIdList, setSelectedGroupIdList] = useState([])
    const [questions, setQuestions] = useState([
        {question: '', answers: ['', '', '', '']},
        {
            question: '', answers: ['', '', '', '']
        }])
    const [textQuestion, setTextQuestion] = useState({})

    useEffect(() => {
        queryParam({
            path: '/api/subject',
            method: 'get'
        }).then(res => {
            setSubjects(res.data.object)
        })
        setLoading(false)
    }, [])

    const selectSubject = () => {
        const subjectName = document.getElementsByName('subject')[0].value;
        queryParam({
            path: '/api/groups/by-subject/' + subjectName,
            method: 'get'
        }).then(res => {
            if (res.status === 200) {
                setGroups(res.data.object)
                setSubjectName(subjectName)
            }
        }).catch(res => {
            console.log(res)
            alert('Guruh topilmadi ! ! !')
            document.getElementsByName('subject')[0].value = '-1'
        });
    }

    const selectGroup = (id) => {
        let groupIdList = [];
        if (!selectedGroupIdList.includes(id)) {
            groupIdList = selectedGroupIdList.splice(0)
            groupIdList.push(id)
        } else {
            const i = selectedGroupIdList.indexOf(id)
            if (i > -1) {
                groupIdList.splice(i, 1)
            }
        }
        setSelectedGroupIdList(groupIdList)
    }

    const changeHandler = (e, i, index, isQuestion) => {
        e.preventDefault()
        if (isQuestion) {
            questions[index].question = e.target.value
        } else {
            questions[index].answers[i] = e.target.value
        }
        setTextQuestion({val: document.getElementsByName(e.target.name)[i].value, index: index})
    }

    const addQuestion = () => {
        const arr = []
        for (let i = 0; i < questions.length; i++) {
            arr[i] = questions[i]
        }
        arr[questions.length] = {question: '', answers: ['', '', '', '']}
        setQuestions(arr)
    }

    const removeQuestion = (i) => {
        let arr = []
        if (i === (questions.length - 1)) {
            arr = questions.slice(0, questions.length - 1)
        } else {
            arr = questions.slice(0, i)
            arr = arr.concat(questions.slice(i + 1))
        }
        setQuestions(arr)
    }

    const saveQuestions = () => {
        if (!isAnyFieldEmpty()) {
            setLoading(true)
            const test = document.getElementsByName('test')[0].value
            const timeForTest = document.getElementById('hour').value + ':' + document.getElementById('minute').value

            for (let i = 0; i < questions.length; i++) {
                questions[i].subjectName = subjectName
            }
            if (test.length < 1) {
                createAll()
            } else {
                createTest(test, timeForTest)
            }
        } else {
            showError('Hamma fildlarni to`ldirishingiz kerak ! ! !')
        }
    }

    const isAnyFieldEmpty = () => {
        for (let question of questions) {
            if (question.question.length < 1) {
                return true
            }
            for (let answer of question.answers) {
                if (answer.length < 1) {
                    return true
                }
            }
        }
        return false
    }

    const showError = (text) => {
        document.getElementById('error-notification').innerText = text
    }

    const createAll = () => {
        queryData({
            path: '/api/question/create-all',
            method: 'post',
            reqQuestionList: questions
        }).then(res => {
            updateState()
            if(res.data.success) {
                alert('Svollar saqlandi!')
            }
        })
    }

    const createTest = (test, timeForTest) => {
        let groupIdList = []
        for (let group of groups) {
            groupIdList.push(group.id)
        }
        queryData({
            path: '/api/test',
            method: 'post',
            title: test,
            time: timeForTest,
            groupIdList,
            reqQuestionList: questions
        }).then(res => {
            updateState()
            if(res.data.success) {
                alert('Test saqlandi!')
            }
        })
    }

    const updateState = () => {
        setSubjectName('')
        setGroups([])
        setSelectedGroupIdList([])
        setQuestions([
            {question: '', answers: ['', '', '', '']},
            {
                question: '', answers: ['', '', '', '']
            }])
        setTextQuestion({})
        setLoading(false)
    }

    return (
        <Layout loading={loading}>
            <div className='container pt-3'>
                <FormGroup>
                    <Label>
                        <p>Fanni tanlang</p>
                        <Input type="select" name="subject" defaultValue='-1' onChange={selectSubject}>
                            <option value='-1' disabled>Fanni tanlang</option>
                            {subjects.map((subject, index) =>
                                <option key={index} value={subject.subjectName}>{subject.subjectName}</option>)}
                        </Input>
                    </Label>
                </FormGroup>

                {groups && groups.map((group, index) =>
                    <FormGroup key={index} check
                               onChange={() => selectGroup(group.id)}>
                        <Label check>
                            <Input type="checkbox"/>
                            <h6 className='pb-3'>{group.name}</h6>
                        </Label>
                    </FormGroup>
                )}

                {
                    subjectName && <div>
                        {selectedGroupIdList.length > 0 && <div>
                            <FormGroup>
                                <Label>
                                    <h5 style={{color: 'indigo'}}>Test nomini kiriting</h5>
                                    <InputGroup>
                                        <Input type="text" name="test"
                                               placeholder=". . ."/>
                                    </InputGroup>
                                </Label>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    <h5>Vaqtni tanlang</h5>
                                    <InputGroup style={{width: '140px'}}>
                                        <Input id='hour' type="select" defaultValue='1'>
                                            <option value='0'>0</option>
                                            <option value='1'>1</option>
                                        </Input>
                                        <Input id='minute' type="select" defaultValue='00'>
                                            <option value='00'>00</option>
                                            <option value='10'>10</option>
                                            <option value='20'>20</option>
                                            <option value='30'>30</option>
                                            <option value='40'>40</option>
                                            <option value='50'>50</option>
                                        </Input>
                                    </InputGroup>
                                </Label>
                            </FormGroup>
                        </div>}
                        {questions.map((question, index) =>
                            <FormGroup className='border-bottom border-secondary p-2' tag="fieldset" key={index}>
                                <legend key={index} className='rounded border-dark row'>
                                    <span className='col-1 mr-2 mr-md-0'>{(index + 1) + '. '}</span>
                                    <Input
                                        onChange={(event) => changeHandler(event, 0, index, true)}
                                        name={'question' + index}
                                        value={question.question}
                                        placeholder='Savol'
                                        className='col-9 col-md-10'/>
                                    <div className='col-1 text-right'>
                                        <Button onClick={() => removeQuestion(index)} color='danger'> - </Button>
                                    </div>
                                </legend>
                                {textQuestion.index === index ?
                                    <div className='text-center mb-2'><Latex
                                        name='questionLatex'>{textQuestion.val}</Latex>
                                    </div> : ''}

                                {question.answers.map((answer, i) =>
                                    <FormGroup key={i} check className='mb-1'>
                                        <Label
                                            className='m-0 w-100'>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        {(i === 0 ? 'A' : i === 1 ? 'B' : i === 2 ? 'C' : 'D') + '   )'}
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    onChange={(event) => changeHandler(event, i, index, false)}
                                                    value={answer}
                                                    placeholder='Javobni kiriting' name={'answer' + index}/>
                                            </InputGroup>
                                        </Label>
                                    </FormGroup>
                                )}
                            </FormGroup>
                        )}
                        <div className='text-right'>
                            <Button onClick={addQuestion} color={'primary'}>Add+ </Button>
                        </div>
                        <div className='text-center'>
                            <p id="error-notification" className='text-danger' />
                            <Button onClick={saveQuestions} color={'success'}>Save</Button>
                        </div>
                    </div>}
            </div>
        </Layout>
    );
}