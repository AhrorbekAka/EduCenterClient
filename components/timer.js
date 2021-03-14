import {useEffect, useState} from 'react'

export default function Timer({time, stopTest}) {
    const [hours, setHours] = useState(parseInt(time.split(':')[0]))
    const [minutes, setMinutes] = useState(parseInt(time.split(':')[1]))
    const [seconds, setSeconds] = useState(parseInt(time.split(':')[2]))

    useEffect(() => {
        setTimeout(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            } else {
                if (minutes > 0) {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                } else {
                    if (hours > 0) {
                        setSeconds(59)
                        setMinutes(59)
                        setHours(hours - 1)
                    }
                }
            }
        }, 1000)
    })

    if(hours === 0 && minutes === 0 && seconds === 0){
        stopTest()
    }

    return (
        <div style={{position: 'sticky', top:'0'}}>
            {minutes === 0 && seconds === 0
                ? <h5 className='text-danger'>Vaqt tugadi ! ! !</h5>
                : <h5 style={{color: 'brown'}}>
                    <span className='text-muted d-none d-md-inline-block'>Qolgan vaqt:</span> {'  '}
                    <b>
                        {hours}:
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </b>
                </h5>
            }
        </div>
    )
}