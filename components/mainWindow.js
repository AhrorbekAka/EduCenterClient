import React, {useState} from "react";

import Image from "next/image";
import Router from "next/router";

export default function MainWindow({menu, title, children, loading}) {

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (touchStartEvent) => {
        setTouchStart(touchStartEvent.targetTouches[0].clientX)
    }

    const handleTouchMove = (touchMoveEvent) => {
        setTouchEnd(touchMoveEvent.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchEnd > 0 && touchStart - touchEnd > 150) {
            swipeRight();
        }

        if (touchStart - touchEnd < -150) {
            swipeLeft();
        }
    }

    const swipeRight = () => {
        switch (title) {
            case 'Studentlar':
                Router.push(menu > 2 ? '/employee' : '/groups')
                break
            case 'Ishchilar':
                Router.push('/groups')
                break
            case 'Guruhlar':
                Router.push('/testCRUD')
                break
            default:
                break
        }
    }

    const swipeLeft = () => {
        switch (title) {
            case 'Ishchilar':
                Router.push('/students')
                break
            case 'Guruhlar':
                Router.push(menu > 2 ? '/employee' : menu > 1 ? '/students' : '')
                break
            case 'Test':
                Router.push(menu > 0 ? '/groups' : '')
                break
            default:
                break
        }
    }

    return (
        <main
            onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
            onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
            onTouchEnd={() => handleTouchEnd()}
            className={' min-vh-100 m-0 ml-md-5 p-md-3'}
            style={{boxSizing: 'border-box', paddingBottom: '55px'}}>

            <p style={{left: 0, right: 0, top: 0}}
               className='bg-success text-white text-center position-absolute d-none d-md-block'>
                Sayt test rejimida ishlamoqda
            </p>

            {loading && <div className='position-relative vh-100 vw-100 text-center'>
                <div
                    className='position-absolute'
                    style={{zIndex: '99', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <Image src="/loading(2).gif"
                           alt="loading..."
                           width={40}
                           height={40}/>
                    <br/>
                    <p className='pl-3 pt-3'> Loading . . .</p>
                </div>
            </div>}

            {!loading && children}
        </main>
    )
}