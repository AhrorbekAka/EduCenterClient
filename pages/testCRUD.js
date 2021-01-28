import {useState, useEffect} from 'react';
import Layout from "../components/layout";
import {InputGroupText, Button, FormGroup, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import {queryData, queryParam} from "../services/requestService";

import 'katex/dist/katex.min.css'
import Latex from "react-latex";
import Image from "next/image";
import * as React from "react";

export default function TestCrud() {
    const [loading, setLoading] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [subjectName, setSubjectName] = useState({})
    const [groups, setGroups] = useState([])
    const [selectedGroupIdList, setSelectedGroupIdList] = useState([])
    const [questions, setQuestions] = useState([{answers: [{}, {}, {}, {}]}, {answers: [{}, {}, {}, {}]}])
    const [ab, setAb] = useState({})

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
            groupIdList = selectedGroupIdList
            groupIdList.push(id)
        } else {
            for (let selectedId of selectedGroupIdList) {
                if (selectedId !== id) {
                    groupIdList.push(selectedId)
                }
            }
        }
        setSelectedGroupIdList(groupIdList)
    }

    const changeHandler = (e, i, index) => {
        e.preventDefault()
        setAb({val: document.getElementsByName(e.target.name)[i].value, index: index})
    }

    const addQuestion = () => {
        let arr = questions
        arr.push({answers: [{}, {}, {}, {}]})
        setQuestions(arr)
    }

    const saveQuestions = () => {
        const test = document.getElementsByName('test')[0].value
        for (let i = 0; i < questions.length; i++) {
            questions[i].question = document.getElementsByName('question' + i)[0].value
            questions[i].subjectName = subjectName
            if (questions[i].question.length < 1) {
                showError('Hamma fildlarni to`ldirishingiz kerak ! ! !')
                return
            }
            for (let j = 0; j < 4; j++) {
                questions[i].answers[j] = {
                    isCorrect: j === 0,
                    answer: document.getElementsByName('answer' + i)[j].value
                }
                if (questions[i].answers[j].answer.length < 1) {
                    showError('Hamma javoblarni kiritishingiz kerak ! ! !')
                    return
                }
            }
        }
        if (test.length < 1) {
            queryData({
                path: '/api/question/create-all',
                method: 'post',
                reqQuestionList: questions
            }).then(res => {
            })
        } else {
            let groupIdList = []
            for (let group of groups) {
                groupIdList.push(group.id)
            }
            queryData({
                path: '/api/test',
                method: 'post',
                title: test,
                groupIdList,
                reqQuestionList: questions
            }).then(res => {
            })
        }
        console.log(questions);
    }

    const showError = (text) => {
        document.getElementById('error-notification').innerText = text
    }

    return (
        <Layout loading={loading}>
            <div className='container'>
                <FormGroup>
                    <Label>
                        <p>Fanni tanlang</p>
                        <Input type="select" name="subject" defaultValue='-1' onChange={selectSubject}>
                            {<>
                                <option value='-1' disabled>Fanni tanlang</option>
                                {subjects.map((subject, index) =>
                                    <option key={index} value={subject.subjectName}>{subject.subjectName}</option>)}
                            </>}

                        </Input>
                    </Label>
                </FormGroup>

                {groups && groups.map((group, index) =>
                    <FormGroup key={index} check
                               onChange={() => selectGroup(group.id)}>
                        <Label check>
                            <Input type="checkbox"/>
                            <h6>{group.name}</h6>
                        </Label>
                    </FormGroup>
                )}

                <FormGroup>
                    <Label>
                        <p>Test</p>
                        <InputGroup>
                            <Input type="text" name="test"
                                   placeholder="Test nomini kiriting"/>
                        </InputGroup>
                    </Label>
                </FormGroup>

                {questions.map((question, index) =>
                    <FormGroup className='border-bottom border-secondary p-2' tag="fieldset" key={index}>
                        <legend key={index} className=' rounded border-dark row'>
                            <span className='col-1 mr-2 mr-md-0'>
                                {(index + 1) + '. '}
                                    </span>
                            <Input
                                onChange={(event) => changeHandler(event, 0, index)}
                                name={'question' + index}
                                placeholder='Savol'
                                className='col-10 col-md-11'/>
                        </legend>
                        {ab.index === index ?
                            <div className='text-center mb-2'><Latex name='questionLatex'>{ab.val}</Latex></div> : ''}
                        {question.answers.map((answer, i) =>
                            <FormGroup check key={i}
                                       className='mb-1'>
                                <Label key={i}
                                       className='m-0 w-100'>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>{' ' + (i === 0 ? 'A' : i === 1 ? 'B' : i === 2 ? 'C' : 'D') + ')  '}</InputGroupText>
                                        </InputGroupAddon>
                                        <Input onChange={(event) => changeHandler(event, i, index)}
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
                    <p id="error-notification" className='text-danger'></p>
                    <Button onClick={saveQuestions} color={'success'}>Save</Button>
                </div>
            </div>
        </Layout>
    );
}