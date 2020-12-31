import AbstractModal from "./abstractModal";
import {FormGroup, Input, Label} from "reactstrap";
import React, {useEffect} from "react";
import {queryData, queryParam} from "../../services/requestService";
import {useState} from "react";

export default function GroupModal({isOpen, setOpen, refresh, group}) {

    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        requestSubjectList()
        requestTeacherList()
    }, [])

    const requestSubjectList = () => {
        queryParam({
            path: '/api/subject',
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                setSubjects(response.data.object)
            }
        });
    }

    const requestTeacherList = () => {
        queryParam({
            path: '/api/user',
            method: 'get'
        }).then(res => {
            if (res.data.success) {
                for (let teacher of res.data.object) {
                    if (group.teachers&&group.teachers.length > 0) {
                        teacher['isTeacher'] = false
                        for (const teacher1 of group.teachers) {
                            if (teacher.id === teacher1.id) {
                                teacher['isTeacher'] = true
                                break
                            }
                        }
                    } else {
                        teacher['isTeacher'] = false
                    }
                }
                setTeachers(res.data.object)
                setLoading(false)
            }
        });
    }

    const onSave = async () => {
        setLoading(true)
        const teacherIds = [];
        for (let item of teachers) {
            if (item.isTeacher) {
                teacherIds.push(item.id)
            }
        }
        const newGroup = {
            id: group.id,
            name: document.getElementsByName("name")[0].value,
            teacherIdList: teacherIds,
            subjectName: document.getElementsByName("subjectName")[0].value,
            payment: document.getElementsByName("payment")[0].value,
            description: document.getElementsByName("description")[0].value,
        };

        await queryData({
            path: '/api/groups',
            method: 'post',
            ...newGroup
        }).then(res => {
                if (res.data.success) {
                    refresh()
                } else {
                    alert(res.data.message)
                }
                setLoading(false)
            }
        )
    };

    const onSelectTeacher = (id) => {
        for (let item of teachers) {
            if (item.id === id) {
                item.isTeacher = !item.isTeacher
            }
        }
        setTeachers(teachers)
    };


    return (
        <AbstractModal isOpen={isOpen} setOpen={setOpen} submit={onSave} loading={loading}>
            <FormGroup>
                <Input type="text" defaultValue={group.name} name="name"
                       placeholder="Guruh nomi"/>
            </FormGroup>
            <FormGroup>
                <Input type="select" name="subjectName" defaultValue={!group.subject?'':group.subject.subjectName}>
                    {(!group.subject ? <>
                            <option>Fanni tanlash</option>
                            {subjects.map((subject, index) => <option
                                key={index}>{subject.subjectName}</option>)}
                        </> :
                        <option selected={true}>{group.subject.subjectName}</option>)}

                </Input>
            </FormGroup>
            <div className="border rounded px-3 py-2 mb-3">
                <h6>O`qituvchilar: </h6>
                {teachers.map((teacher, index) =>
                    <FormGroup key={index} check className="ml-3"
                               onChange={() => onSelectTeacher(teacher.id)}>
                        <Label check>
                            <Input type="checkbox" defaultChecked={teacher.isTeacher}/>
                            <h6>{teacher.firstName + ' ' + teacher.lastName}</h6>
                        </Label>
                    </FormGroup>
                )}
            </div>
            <FormGroup>
                <Input type="text" defaultValue={group.payment} name="payment"
                       placeholder="Bu guruh uchun boshlang`ich to`lovni kirting"/>
            </FormGroup>
            <FormGroup>
                <Input type="text" defaultValue={group.description} name="description"
                       placeholder="Qo`shimcha ma`lumot"/>
            </FormGroup>
        </AbstractModal>
    )
}