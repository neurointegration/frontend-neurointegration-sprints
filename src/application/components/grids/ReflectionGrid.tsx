import clsx from 'clsx';
import './ReflectionGridStyle.css';
import { ReflectionTypes } from '../../../core/api/utils/reflectionAnswersTransformer';
import ReflectionCard, { textLabelPairType } from '../_cards/ReflectionCard';
import { reflectionClassNames } from '../../../Platform/_types/ReflectionsTypes';
import { ReflectionRegistryProps } from '../_registry/ReflectionRegistry';

type reflectionGridCardProps = {
    textLabel : textLabelPairType[];
    className : string;
    header: string;
};

type ReflectionGridProps = {
    props: ReflectionRegistryProps[];
}

export function ReflectionGrid(props: ReflectionGridProps) {

    const regularCardList : reflectionGridCardProps[] = [];
    const integrationCardList : reflectionGridCardProps[] = [];

    props.props.map((prop) => 
    {
        if (prop.reflectionType == ReflectionTypes.Regular) {
            regularCardList.push({header: prop.cards.Doing.header, textLabel: prop.cards.Doing.textLabelPairsArray, className: prop.cards.Doing.reflectionCN + prop.number.toString()});
            regularCardList.push({header: prop.cards.State.header, textLabel: prop.cards.State.textLabelPairsArray, className: prop.cards.State.reflectionCN + prop.number.toString()});
            regularCardList.push({header: prop.cards.Orbits.header, textLabel: prop.cards.Orbits.textLabelPairsArray, className: prop.cards.Orbits.reflectionCN + prop.number.toString()});
            regularCardList.push({header: prop.cards.Correction.header, textLabel: prop.cards.Correction.textLabelPairsArray, className: prop.cards.Correction.reflectionCN + prop.number.toString()});
        }
        else {
            integrationCardList.push({header: prop.cards.Changes.header, textLabel: prop.cards.Changes.textLabelPairsArray, className: prop.cards.Changes.reflectionCN + prop.number.toString()});
            integrationCardList.push({header: prop.cards.Actions.header, textLabel: prop.cards.Actions.textLabelPairsArray, className: prop.cards.Actions.reflectionCN + prop.number.toString()});
            integrationCardList.push({header: prop.cards.Abilities.header, textLabel: prop.cards.Abilities.textLabelPairsArray, className: prop.cards.Abilities.reflectionCN + prop.number.toString()});
            integrationCardList.push({header: prop.cards.Beliefs.header, textLabel: prop.cards.Beliefs.textLabelPairsArray, className: prop.cards.Beliefs.reflectionCN + prop.number.toString()});
            integrationCardList.push({header: prop.cards.SelfPerception.header, textLabel: prop.cards.SelfPerception.textLabelPairsArray, className: prop.cards.SelfPerception.reflectionCN + prop.number.toString()});
            integrationCardList.push({header: prop.cards.Opportunities.header, textLabel: prop.cards.Opportunities.textLabelPairsArray, className: prop.cards.Opportunities.reflectionCN + prop.number.toString()});
        }
    });
    return (
        <div className='reflection-grid'>
            {ReflectionRegularGridSection(regularCardList)}
            {ReflectionIntegrationGridSection(integrationCardList)}
        </div>
    );
}


function ReflectionRegularGridSection(cards: reflectionGridCardProps[]) {
    return (
        <div className='reflection-cards-grid-section section-type-regular'>
        <div className='reflection-cards-grid grid-type-regular'>
            <h3 className='reflection-week reflection-week-number1'>Неделя 1</h3>
            <h3 className='reflection-week reflection-week-number2'>Неделя 2</h3>
            <h3 className='reflection-week reflection-week-number3'>Неделя 3</h3>
            {cards.map((card) => 
            <div className={clsx('reflection-grid-card-' + card.className)}>
                <ReflectionCard header={card.header} textLabelPairsArray={card.textLabel} reflectionCN={reflectionClassNames.Default}/>
            </div>
            )}
        </div>
    </div>
    );
}


function ReflectionIntegrationGridSection(cards: reflectionGridCardProps[]) {
        return (
            <div className='reflection-cards-grid-section section-type-integration'>
                <div className='reflection-cards-grid grid-type-integration'>
                    <h3 className='reflection-week reflection-week-number4'>Неделя 4</h3>
                    {cards.map((card) => 
                <div className={clsx('reflection-grid-card-' + card.className)}>
                    <ReflectionCard header={card.header} textLabelPairsArray={card.textLabel} reflectionCN={reflectionClassNames.Default}/>
                </div>
            )}
                </div>
            </div>
        );
    }

export default ReflectionGrid;