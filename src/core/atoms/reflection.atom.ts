import { atom } from 'recoil';
import { SprintResponseType } from '../api/actions/sprints';

const ReflectionSprintsAtom = atom<SprintResponseType[]>({
    key: 'reflectionSprints',
    default: [],
});

export default ReflectionSprintsAtom;