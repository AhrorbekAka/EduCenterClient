import Layout from "../components/layout";
import {Button, FormGroup, Input} from "reactstrap";
import React, {useState} from "react";
import {queryParam} from "../services/requestService";


export default function Settings() {

    const [response, setResponse] = useState({isError: false, message: ''})
    const [isBtnDisabled, setBtnDisabled] = useState(false)

    const onChange = async () => {
        setBtnDisabled(true)
        setResponse({isError: false, message: ''})

        const currentPassword = document.getElementsByName("currentPassword")[0].value
        const newPassword = document.getElementsByName("newPassword")[0].value
        const confirmNewPassword = document.getElementsByName("confirmNewPassword")[0].value

        // currentPassword.length<6 ||
        if ( newPassword.length<6 || confirmNewPassword.length<6){
            setResponse({isError: true, message: "Ey yaxshi inson katak bo`sh qolibdiku. Parolni o`zgartirish unchun hamma kattaklarni to`ldirishingiz zarur."})
        }
        else if (newPassword !== confirmNewPassword) {
            setResponse({isError: true, message: "Yangi parol tasdiqlanmadi"})
        } else if (currentPassword === newPassword) {
            setResponse({isError: true, message: "O`yin qilish yaxshimaaas 😡. Boshqa parol kiriting, iltimos."})
        } else {
            const {data} = await queryParam({
                path: '/api/auth/changePassword',
                method: 'patch',
                currentPassword,
                newPassword,
                confirmNewPassword
            })
            clearInputs()
            setResponse({isError: !data.success, message: data.message})
        }
        setBtnDisabled(false)
    }

    const clearInputs = () => {
        document.getElementsByName("currentPassword")[0].value = ''
        document.getElementsByName("newPassword")[0].value = ''
        document.getElementsByName("confirmNewPassword")[0].value = ''
    }

    return (
        <Layout title={"Sozlamalar"}>
            <div className="row mt-5 pt-5">
                <div className='col-10 offset-1 col-md-4 offset-md-4 pt-5 text-center'>
                    <h3 className='text-info mb-4'>Parolni o`zgartirish</h3>
                    <p className={response.isError ? 'text-danger' : 'text-success'}>{response.message}</p>
                    <FormGroup>
                        <Input type="password" name="currentPassword"
                               placeholder="Parolni kiriting"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" name="newPassword"
                               placeholder="Yangi parolni kiriting"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" name="confirmNewPassword"
                               placeholder="Yangi parolni tasdiqlang"/>
                    </FormGroup>
                    <FormGroup className="text-center">
                        <Button disabled={isBtnDisabled} color="success" onClick={onChange}>O`zgartirish</Button>
                    </FormGroup>
                </div>
            </div>
        </Layout>
    )
}