import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function confirmAlertService(title, name, onYes, params, isPresent) {
    confirmAlert({
        title: title+'ni o`chirish',
        message: <p>
            <strong>{name}</strong> {isPresent ? title.toLowerCase()+'ni o`chirmoqchimisiz' : title.toLowerCase()+'ni tiklamoqchimisiz'}
        </p>,
        buttons: [
            {
                label: 'Ha',
                onClick: () => onYes(params)
            },
            {
                label: 'Yo`q',
            }
        ]
    });
}