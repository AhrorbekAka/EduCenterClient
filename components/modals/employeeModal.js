import React, {useState} from "react";
import AbstractModal from "./abstractModal";
import {FormGroup, Input, ModalBody} from "reactstrap";
import {queryData} from "../../services/requestService";

export default function EmployeeModal({isOpen, setOpen, user, refresh}) {
    const [loading, setLoading] = useState(false)

    const onSave = async () => {
        setLoading(true)
        const newUser = {
            id: user.id,
            firstName: document.getElementsByName('firstName')[0].value,
            lastName: document.getElementsByName('lastName')[0].value,
            phoneNumber: document.getElementsByName('phoneNumber')[0].value,
        };
        await queryData({
            path: '/api/user',
            method: 'post',
            ...newUser
        });
        await refresh(true)
        setLoading(false)
    };

    return (
        <AbstractModal isOpen={isOpen} setOpen={setOpen} submit={onSave} loading={loading}>
            <FormGroup>
                <Input type="text" defaultValue={user.firstName} name="firstName"
                       placeholder="Ism"/>
            </FormGroup>
            <FormGroup>
                <Input type="text" defaultValue={user.lastName} name="lastName"
                       placeholder="Familiya"/>
            </FormGroup>
            <FormGroup>
                <Input type="text" name="phoneNumber" defaultValue={user.phoneNumber}
                       placeholder="Telefon raqami"/>
            </FormGroup>
            {/*<FormGroup>*/}
            {/*    <Input type="text" name="password" */}
            {/*           placeholder="Yangi parol"/>*/}
            {/*</FormGroup>*/}
        </AbstractModal>
    )
}
