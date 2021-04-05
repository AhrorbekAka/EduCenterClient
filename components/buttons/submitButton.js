import {Button} from "reactstrap";
import Image from "next/image";

export default function SubmitButton({submit, style, className, disabled, loading}){
    return <Button
        onClick={submit}
        style={style}
        className={className}
        disabled={disabled}
        color={"success"}>
        {loading ? <Image
            src="/button-loading.gif"
            alt="loading..."
            width={20}
            height={20}/> : 'Submit'}
    </Button>
}