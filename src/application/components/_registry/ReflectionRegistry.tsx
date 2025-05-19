import clsx from 'clsx';
import './ReflectionRegistryStyle.css';
import { ReflectionTypes } from '../../../core/api/utils/reflectionAnswersTransformer';
import ReflectionCard, { ReflectionCardProps } from '../_cards/ReflectionCard';
import { Icons } from '../../../Platform/_types/Icons';
import { useState } from 'react';
import { CommonReflectionType, IntegrationReflectionType, RegularReflectionType } from '../../../Platform/_types/ReflectionsTypes';

export type ReflectionRegistryProps = {
    number: number;
    reflectionType: ReflectionTypes;
    cards: CommonReflectionType;
};

export function ReflectionRegistry({
number, reflectionType, cards
}: ReflectionRegistryProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const expanderClickHandler = () => {
        if (isOpen) {
            setIsOpen(() => {
                return false;
            })
        }
        else {
            setIsOpen(() => {
                return true;
            });
        }
        return;
    };

    const expanderIconCN = clsx(
            'reflection-card_label_expander-button_icon',
            isOpen && 'icon_rotated'
        );

    return (
        <div className={clsx('reflection-registry reflection-registry-type-' + reflectionType)}>
            <button className='reflection-registry_button'
                onClick={expanderClickHandler}
            >
                <h3>Неделя {number}</h3>
                <img
                    aria-hidden
                    className={expanderIconCN}
                    src={Icons.dropdownArrow}
                />
            </button>
            {isOpen ? 
            reflectionType == ReflectionTypes.Regular ? 
            ReflectionRegularRegistry({
                Doing : cards.Doing,
                State : cards.State,
                Orbits: cards.Orbits,
                Correction: cards.Correction
            })
            : 
            ReflectionIntegrationRegistry({
                Changes : cards.Changes,
                Actions: cards.Actions,
                Abilities : cards.Abilities,
                Beliefs: cards.Beliefs,
                SelfPerception : cards.SelfPerception,
                Opportunities: cards.Opportunities,         
            })
            :
            <div/>}
        </div>
    );
}


function ReflectionRegularRegistry(cards: RegularReflectionType) {
    return (
        <div className='reflection-cards-list'>
            <ReflectionCard header={cards.Doing.header} reflectionCN={cards.Doing.reflectionCN} textLabelPairsArray={cards.Doing.textLabelPairsArray}/>
            <ReflectionCard header={cards.State.header} reflectionCN={cards.State.reflectionCN} textLabelPairsArray={cards.State.textLabelPairsArray}/>
            <ReflectionCard header={cards.Orbits.header} reflectionCN={cards.Orbits.reflectionCN} textLabelPairsArray={cards.Orbits.textLabelPairsArray}/>
            <ReflectionCard header={cards.Correction.header} reflectionCN={cards.Correction.reflectionCN} textLabelPairsArray={cards.Correction.textLabelPairsArray}/>
        </div>
    );
}


function ReflectionIntegrationRegistry(cards: IntegrationReflectionType) {
        return (
            <div className='reflection-cards-list'>
            <ReflectionCard header={cards.Changes.header} reflectionCN={cards.Changes.reflectionCN} textLabelPairsArray={cards.Changes.textLabelPairsArray}/>
            <ReflectionCard header={cards.Actions.header} reflectionCN={cards.Actions.reflectionCN} textLabelPairsArray={cards.Actions.textLabelPairsArray}/>
            <ReflectionCard header={cards.Abilities.header} reflectionCN={cards.Abilities.reflectionCN} textLabelPairsArray={cards.Abilities.textLabelPairsArray}/>
            <ReflectionCard header={cards.Beliefs.header} reflectionCN={cards.Beliefs.reflectionCN} textLabelPairsArray={cards.Beliefs.textLabelPairsArray}/>
            <ReflectionCard header={cards.SelfPerception.header} reflectionCN={cards.SelfPerception.reflectionCN} textLabelPairsArray={cards.SelfPerception.textLabelPairsArray}/>
            <ReflectionCard header={cards.Opportunities.header} reflectionCN={cards.Opportunities.reflectionCN} textLabelPairsArray={cards.Opportunities.textLabelPairsArray}/>
            </div>
        );
    }

export default ReflectionRegistry;