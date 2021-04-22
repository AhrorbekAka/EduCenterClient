import React, {useState} from "react";
import AbstractModal from "./abstractModal";
import {Button, FormGroup, Input, InputGroup, InputGroupAddon, ModalBody} from "reactstrap";
import {queryData} from "../../services/requestService";

export default function EmployeeModal({isOpen, setOpen, user, isDirector, refresh}) {
    const [loading, setLoading] = useState(false)
    const [passwordLocked, setPasswordLocked] = useState(true)

    const onSave = async () => {
        setLoading(true)
        const newUser = {
            id: user.id,
            firstName: document.getElementsByName('firstName')[0].value,
            lastName: document.getElementsByName('lastName')[0].value,
            roleName: document.getElementsByName("roleName")[0].value,
            phoneNumber: document.getElementsByName('phoneNumber')[0].value,
            password: passwordLocked ? '' : document.getElementsByName('password')[0].value,
        };
        await queryData({
            path: '/api/user',
            method: 'post',
            ...newUser
        }).catch(res=>console.log(res));
        await refresh(true)
        setOpen(false)
        setLoading(false)
    };

    const unlockChangePassword = () => {
        const newPassword = document.getElementsByName('password')[0].value
        if (newPassword.length > 0) {
            document.getElementsByName('password')[0].value = ''
        }
        setPasswordLocked(!passwordLocked)
    }

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
                <Input type="select" name="roleName" defaultValue={user.roles && user.roles[0].name}>
                    {isDirector ? <option value="" selected={true} disabled>DIRECTOR</option> :
                        <>
                            <option selected={true}>TEACHER</option>
                            <option>ADMIN</option>
                        </>
                    }
                </Input>
            </FormGroup>
            <FormGroup>
                <Input type="text" name="phoneNumber" defaultValue={user.phoneNumber}
                       placeholder="Telefon raqami"/>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                    <Input disabled={passwordLocked} type="text" name='password' placeholder='Yangi parol'/>
                    <InputGroupAddon addonType="append">
                        <Button onClick={unlockChangePassword}
                                color={'info'}>{passwordLocked ? 'unlock' : 'lock'}</Button>
                    </InputGroupAddon>
                </InputGroup>
            </FormGroup>
        </AbstractModal>
    )
}
