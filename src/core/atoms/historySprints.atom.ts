import { atom } from 'recoil';
import { SprintResponseType } from '../api/actions/sprints';

const HistorySprintsAtom = atom<SprintResponseType[]>({
    key: 'historySprints',
    default: [],
});

export default HistorySprintsAtom;
