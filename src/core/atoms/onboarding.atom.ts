import { atom } from 'recoil';
import { Onboarding } from '../api/actions/me';

const OnboardingAtom = atom<Onboarding>({
    key: 'onboardingInformation',
    default: {
            dateOnboarding: false,
            projectOnboarding: false,
            editingOnboarding: false,
            clientsOnboarding: false,
        },
    },
);

export default OnboardingAtom;
