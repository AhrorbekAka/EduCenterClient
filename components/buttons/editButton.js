import {Button} from "reactstrap";
import Image from "next/image";

export default function EditButton({submit, size, style}){
    return <Button onClick={submit} style={style} className='bg-transparent p-0 text-primary border-0'>
        <Image
            src="/edit-icon.png"
            alt="edit"
            width={!size?'20px':size}
            height={!size?'20px':size}/>
    </Button>
}