import { atom } from 'recoil';
import { SectionType } from '../../Platform/_tabs/TabType';
import { BaseRegistryType, SECTIONS } from '../../application/screens/home/constants';

type ScreensSectionsStateType = {
    [key in BaseRegistryType]: SectionType;
};

const ScreensSectionsAtom = atom<ScreensSectionsStateType>({
    key: 'screensSections',
    default: {
        [BaseRegistryType.MainSprint]: SECTIONS[0],
        [BaseRegistryType.History]: SECTIONS[0],
        [BaseRegistryType.ClientSprint]: SECTIONS[0],
    },
});

export default ScreensSectionsAtom;
