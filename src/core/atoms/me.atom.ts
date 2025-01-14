import { atom } from 'recoil';
import { MeResponseType } from '../api/actions/me';

const MeInformationAtom = atom<MeResponseType>({
    key: 'meInformation',
    default: {
        id: null,
        firstName: null,
        lastName: null,
        aboutMe: null,
        photoUrl: null,
        isOnboardingComplete: false,
        // TODO: узнать про значение по умолчанию, что если с бэка ничего не придет здесь
        sprintWeeksCount: 4,
    },
});

export default MeInformationAtom;
