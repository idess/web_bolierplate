import {API_BASE_URL} from "./constants";
import { ajax } from "rxjs/observable/dom/ajax";
import { getItem } from './local-storage.service';
import * as queryString from 'query-string';
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// const APP_PREFIX = 'POLAR-';

export function api(type, path, params) {
    let baseUrl = isLocalhost ? `${API_BASE_URL}/api` : '/api';
    let paramsLink = path.indexOf('?') === -1 ? '?' : '&';
    let token = getItem('AUTH.USERINFO') !== null ? getItem('AUTH.USERINFO').id : '';
    if(token === '') {
        // 로그인으로 이동
        window.location.href = "/auth/login";
    }
    let url = path === '/Accounts/login' ? `${baseUrl}${path}${paramsLink}` : `${baseUrl}${path}${paramsLink}access_token=` + token;
    url = url.replace(/"/gi, '');
    console.log(url);
    console.log(params);
    switch (type) {
        case 'get': {
            url += `&${queryString.stringify(params)}`;
            return ajax.get(url); //, params
        }
        case 'post': {
            return ajax.post(url, params);
        }
        case 'put': {
            return ajax.put(url, params);
        }
        case 'delete': {
            return ajax.delete(url, params);
        }
        case 'patch': {
            return ajax.patch(url, params);
        }
        default:
            return;
    }

}