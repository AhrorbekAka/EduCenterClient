import {Button} from "reactstrap";
import Image from "next/image";

export default function DeleteButton({submit, size, style, isDelete, disabled, disableBtn}){
    return <Button onClick={submit} disabled={disabled} color={isDelete?'danger':'info'} style={style} className='bg-transparent border-0 p-0'>
        <Image
            src={disableBtn===false?'/Delete-Bin-Trash.png':(!isDelete?"/cancel.png":'/undo-4-128.png')}
            alt="delete"
            width={!size?'20px':size}
            height={!size?'20px':size}/>
    </Button>
}