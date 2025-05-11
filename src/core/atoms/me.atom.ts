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
        isOnboardingComplete: true,
        sprintWeeksCount: 4,
        onboarding: {
            dateOnboarding: false,
            projectOnboarding: false,
            editingOnboarding: false,
            clientsOnboarding: false,
        },
    },
});

export default MeInformationAtom;
