import AbstractModal from "./abstractModal";
import {Input} from "reactstrap";
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
            })
            refresh()
        } else {
            document.getElementById('notification').innerHTML = 'Eng kam to`lov miqdori 100 000 so`m.'
            document.getElementById("payment").value = ''
        }
        setLoading(false)
    }

    return (
        <AbstractModal isOpen={isOpen} setOpen={setOpen} submit={savePayment}>
            <Input id="payment" placeholder='Summa' type="text" defaultValue={payload.group.payment}/>
            <p id='notification' className='text-center text-danger'> </p>
        </AbstractModal>
    )
}