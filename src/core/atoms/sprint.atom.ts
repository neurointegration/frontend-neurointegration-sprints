import { atom } from 'recoil';
import { SprintResponseType } from '../api/actions/sprints';

const CurrentSprintAtom = atom<SprintResponseType>({
    key: 'currentSprint',
    default: {
        number: null,
        weeksCount: 0,
        beginDate: null,
        endDate: null,
        weeks: {},
    },
});

export default CurrentSprintAtom;
