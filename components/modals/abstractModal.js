import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import Modal from "reactstrap/lib/Modal";
import {Button, FormGroup} from "reactstrap";

export default function AbstractModal({isOpen, setOpen, submit, children}) {
    const toggle = () => setOpen(false)

    const onSave = () => {
        toggle()
        submit()
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} unmountOnClose={true}>
            <ModalHeader toggle={toggle} className="bg-info text-white">
                Yangi abituriyent qo`shish
            </ModalHeader>
            <ModalBody>
                {children}
                <FormGroup className="text-right">
                    <Button color="success" onClick={onSave}>Saqlash</Button>
                </FormGroup>
            </ModalBody>
        </Modal>)
}