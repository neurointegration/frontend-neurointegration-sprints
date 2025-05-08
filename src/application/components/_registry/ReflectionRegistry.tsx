import clsx from 'clsx';
import './ReflectionRegistryStyle.css';
import { ReflectionTypes } from '../../../core/api/utils/reflectionAnswersTransformer';
import { ReflectionCardProps } from '../_cards/ReflectionCard';



export type ReflectionRegistryProps = {
    number: number;
    reflectionType: ReflectionTypes;
    cards: ReflectionCardProps[];
};




function ReflectionRegistry({
number, reflectionType
}: ReflectionRegistryProps) {
    const reflectionRegistryCN = 'reflection-registry reflection-registry-'
    return (
        <div className={clsx(reflectionRegistryCN + reflectionType)}>
            <h1>Неделя {number}</h1>
            <div className='reflection-card_text-blocks-container'>
            </div>
        </div>
    );
}

export default ReflectionRegistry;