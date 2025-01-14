import { atom } from 'recoil';
import { AuthWithoutStatusType } from '../api/actions/auth';

const AuthAtom = atom<AuthWithoutStatusType>({
    key: 'auth',
    default: {
        data: {
            accessToken: localStorage.getItem('accessToken') || '',
            refreshToken: localStorage.getItem('refreshToken') || '',
        },
    },
});

export default AuthAtom;
