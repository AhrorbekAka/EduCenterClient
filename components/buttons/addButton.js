import {Button} from "reactstrap";
import Image from "next/image";

export default function AddButton({submit, size, style, disabled}){
    return <Button onClick={submit} disabled={disabled} color={'light'} style={style} className='px-2 pb-0 pt-1'>
        <Image
            src="/add-user.png"
            alt="add +"
            width={!size?'20px':size}
            height={!size?'20px':size}/>
    </Button>
}