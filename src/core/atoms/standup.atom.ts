import { atom } from 'recoil';
import { SprintResponseType } from '../api/actions/sprints';

const StandupSprintsAtom = atom<SprintResponseType[]>({
    key: 'standupSprints',
    default: [],
});

export default StandupSprintsAtom;