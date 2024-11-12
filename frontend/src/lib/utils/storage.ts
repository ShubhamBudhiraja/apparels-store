import { STORAGE_TYPE } from '@enums/storage';
import Cookies, { CookieSetOptions } from 'universal-cookie';

const getCookies = (key: string) => {
    const cookies = new Cookies();
    const val = cookies.get(key);
    return val;
};

const removeCookies = (key: string) => {
    const cookies = new Cookies();
    const val = cookies.remove(key);
    return val;
};

const setCookies = ({ key, value, expiryDays }: { key: string; value: string; expiryDays?: number }) => {
    const cookies = new Cookies();
    const cookieOptions: CookieSetOptions = {
        path: '/',
        secure: true,
    };
    if (expiryDays) {
        const date = new Date();
        date.setDate(date.getDate() + expiryDays);
        cookieOptions.expires = date;
    }
    cookies.set(key, value, cookieOptions);
};

export const getStorageItem = ({ key, storageType }: { key: string; storageType: STORAGE_TYPE }) => {
    let data: any;
    switch (storageType) {
        case STORAGE_TYPE.SESSION:
            data = sessionStorage.getItem(key);
            break;
        case STORAGE_TYPE.LOCAL:
            data = localStorage.getItem(key);
            break;
        case STORAGE_TYPE.COOKIE:
            data = getCookies(key);
            break;
        default:
            break;
    }
    return data;
};

export const setStorageItem = ({
    key,
    value = '',
    storageType,
    expiryDays,
}: {
    key: string;
    value?: string;
    storageType: STORAGE_TYPE;
    expiryDays?: number;
}) => {
    switch (storageType) {
        case STORAGE_TYPE.SESSION:
            sessionStorage.setItem(key, value);
            break;
        case STORAGE_TYPE.LOCAL:
            localStorage.setItem(key, value);
            break;
        case STORAGE_TYPE.COOKIE:
            setCookies({ key, value, expiryDays });
            break;
        default:
            break;
    }
};

export const removeStorageItem = ({ key, storageType }: { key: string; storageType: STORAGE_TYPE }) => {
    switch (storageType) {
        case STORAGE_TYPE.SESSION:
            sessionStorage.removeItem(key);
            break;
        case STORAGE_TYPE.LOCAL:
            localStorage.removeItem(key);
            break;
        case STORAGE_TYPE.COOKIE:
            removeCookies(key);
            break;
        default:
            break;
    }
};
