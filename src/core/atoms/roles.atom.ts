import { atom } from 'recoil';

const RolesAtom = atom<{ isTrainer: boolean }>({
    key: 'roles',
    default: {
        isTrainer: false,
    },
});

export default RolesAtom;
