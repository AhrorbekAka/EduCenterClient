import AbstractModal from "./abstractModal";
import ModalBody from "reactstrap/lib/ModalBody";
import {Input} from "reactstrap";
import {queryData} from "../../services/requestService";

export default function PaymentModal({isOpen, setOpen, payload, refresh}) {

    const savePayment = async () => {
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
    }

    return (
        <AbstractModal isOpen={isOpen} setOpen={setOpen} submit={savePayment}>
            <Input id="payment" placeholder='Summa' type="text" defaultValue={payload.group.payment}/>
            <p id='notification' className='text-center text-danger'> </p>
        </AbstractModal>
    )
}