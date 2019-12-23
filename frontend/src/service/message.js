
import { setItem } from './local-storage.service';
import {NotificationManager} from 'react-notifications';

export function successMsg(msg) {
    NotificationManager.success(msg.message, msg.name);
}

export function warningMsg(msg) {
    NotificationManager.warning(msg.message, msg.name);
}

export function errorMsg(err) {
    if(err.status === 401) {
        setItem('AUTH.USERINFO', {});
        window.location.href = "/auth/login";
    }
    let message = err.message;
    let title = err.name;
    if(err.response) {
        message = err.response.error.message;
        title = err.response.error.name;
    }
    NotificationManager.error(message, title);
}

