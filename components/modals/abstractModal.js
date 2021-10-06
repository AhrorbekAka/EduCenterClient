import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import Modal from "reactstrap/lib/Modal";
import {Button, FormGroup} from "reactstrap";
import Image from "next/image";

export default function AbstractModal({isOpen, setOpen, submit, loading, header, children}) {
    const toggle = () => setOpen(false)

    const onSave = () => {
        submit()
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} unmountOnClose={true}>
            <ModalHeader toggle={toggle} className="bg-info text-white">
                {header}
            </ModalHeader>
            <ModalBody>
                {children}
                <FormGroup className="text-right">
                    <Button
                        disabled={loading}
                        color={"success"}
                        className={loading? 'px-4 pt-2 pb-1':''}
                        style={{width: '100px'}}
                        onClick={onSave}>
                        {loading ? <Image
                            src="/button-loading.gif"
                            alt="loading..."
                            width={20}
                            height={20}/> : 'Saqlash'}
                    </Button>
                </FormGroup>
            </ModalBody>
        </Modal>)
}