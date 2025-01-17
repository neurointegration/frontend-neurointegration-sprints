import { atom } from 'recoil';
import { SectionType } from '../../Platform/_tabs/TabType';
import { SECTIONS } from '../../application/screens/home/constants';

const MainSectionAtom = atom<{ selectedSectionTab: SectionType }>({
    key: 'mainSelectedSection',
    default: {
        selectedSectionTab: SECTIONS[0],
    },
});

export default MainSectionAtom;
