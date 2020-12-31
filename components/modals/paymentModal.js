import AbstractModal from "./abstractModal";
import {InputGroupAddon, InputGroup, Button, Input} from "reactstrap";
import {queryData} from "../../services/requestService";
import {useState} from 'react'

export default function PaymentModal({isOpen, setOpen, payload, refresh}) {
    const [loading, setLoading] = useState(false)

    const savePayment = async () => {
        setLoading(true)
        const paymentAmount = document.getElementById("payment").value
        if (paymentAmount.length > 0 && paymentAmount >= 100000) {
            await queryData({path: '/api/student/payment', method: 'patch', paymentAmount, ...payload.student}).then(res => {
                if (!res.data.success) {
                    alert(res.data.message)
                }
                setOpen(false)
            })
            refresh()
        } else {
            document.getElementById('notification').innerHTML = 'Eng kam to`lov miqdori 100 000 so`m.'
            document.getElementById("payment").value = ''
        }
        setLoading(false)
    }

    const setGroupCost=()=>{
        document.getElementById("payment").value = payload.group.payment
    }

    return (
        <AbstractModal isOpen={isOpen} setOpen={setOpen} submit={savePayment} loading={loading}>
            <InputGroup>
                <Input id="payment" placeholder='Summa' type="text"/>
                <InputGroupAddon addonType="append">
                    <Button onClick={setGroupCost} color={'info'} >{payload.group.payment}</Button>
                </InputGroupAddon>
            </InputGroup>
            <p id='notification' className='text-center text-danger'> </p>
        </AbstractModal>
    )
}