import { ReflectionRegistryProps } from "../../../application/components/_registry/ReflectionRegistry";
import { ReflectionAnswerTypeEnum } from "../../../Platform/_types/AnswerTypes";
import { CommonReflectionType, reflectionClassNames } from "../../../Platform/_types/ReflectionsTypes";
import { ReflectionResponseType } from "../actions/reflection";

export enum ReflectionTypes {
    Regular = "regular",
    Integration = "integration"
}


export function transformReflections(
    responses: ReflectionResponseType[]
): ReflectionRegistryProps[] {

    const etalonReflection : CommonReflectionType = {
        Doing : {
            reflectionCN : reflectionClassNames.Doing,
            header: 'Шаг 1. Действия',
            textLabelPairsArray: []
        },
        State : {
            reflectionCN : reflectionClassNames.State,
            header: 'Шаг 2.  Динамика состояния',
            textLabelPairsArray: []
        },
        Orbits : {
            reflectionCN : reflectionClassNames.Orbits,
            header: 'Шаг 3. Анализ орбит',
            textLabelPairsArray: []
        },
        Correction : {
            reflectionCN : reflectionClassNames.Correction,
            header: 'Шаг 4. Корректировка курса',
            textLabelPairsArray: []
        },
        Changes : {
            reflectionCN : reflectionClassNames.Changes,
            header: 'Шаг 1. Изменения',
            textLabelPairsArray: []
        },
        Actions : {
            reflectionCN : reflectionClassNames.Actions,
            header: 'Шаг 2. Действия',
            textLabelPairsArray: []
        },
        Abilities : {
            reflectionCN : reflectionClassNames.Abilities,
            header: 'Шаг 3. Способности',
            textLabelPairsArray: []
        },
        Beliefs : {
            reflectionCN : reflectionClassNames.Beliefs,
            header: 'Шаг 4. Убеждения',
            textLabelPairsArray: []
        },
        SelfPerception : {
            reflectionCN : reflectionClassNames.SelfPerception,
            header: 'Шаг 5. Восприятие себя',
            textLabelPairsArray: []
        },
        Opportunities : {
            reflectionCN : reflectionClassNames.Opportunities,
            header: 'Шаг 6. Возможности',
            textLabelPairsArray: []
        },
    }

    const groupedByNumber: ReflectionRegistryProps[] = [
        {
            number : 1,
            reflectionType: ReflectionTypes.Regular,
            cards: JSON.parse(JSON.stringify(etalonReflection)),
        },
        {
            number : 2,
            reflectionType: ReflectionTypes.Regular,
            cards: JSON.parse(JSON.stringify(etalonReflection)),

        },
        {
            number : 3,
            reflectionType: ReflectionTypes.Regular,
            cards: JSON.parse(JSON.stringify(etalonReflection)),

        },
        {
            number : 4,
            reflectionType: ReflectionTypes.Integration,
            cards: JSON.parse(JSON.stringify(etalonReflection)),
        }
    ];

    if (responses) {

    responses.forEach((response) => {
        const { sprintReplyNumber, answerType, answer } = response;

        switch (answerType) {
            case ReflectionAnswerTypeEnum.Changes:
                groupedByNumber[3]
                .cards
                .Changes.textLabelPairsArray
                .push({index: 0, label: 'Какое главное изменение я замечаю?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Actions:
                groupedByNumber[3]
                .cards
                .Actions
                .textLabelPairsArray.push({index: 0, label: 'Какие мои действия к этому привели?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Abilities:
                groupedByNumber[3]
                .cards
                .Abilities
                .textLabelPairsArray.push({index: 0, label: 'Какие мои способности мне помогли?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Beliefs:
                groupedByNumber[3]
                .cards
                .Beliefs
                .textLabelPairsArray.push({index: 0, label: 'Как изменились мои убеждения о том, что возможно?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.SelfPerception:
                groupedByNumber[3]
                .cards
                .SelfPerception
                .textLabelPairsArray.push({index: 0, label: 'Как изменились мои убеждения о себе и отношения с собой?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Opportunities:
                groupedByNumber[3]
                .cards
                .Opportunities
                .textLabelPairsArray.push({index: 0, label: 'Какие возможности теперь для меня доступны?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.IDoing:
                groupedByNumber[sprintReplyNumber]
                .cards
                .Doing
                .textLabelPairsArray.push({index: 0, label: 'Что я сделал(а) по своим проектам на этой неделе?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.IDoingTest:
                break;
            case ReflectionAnswerTypeEnum.INotDoing:
                groupedByNumber[sprintReplyNumber]
                .cards
                .Doing
                .textLabelPairsArray.push({index: 1, label: 'Что я не сделал(а) по своим проектам на этой неделе?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.State:
                groupedByNumber[sprintReplyNumber]
                .cards
                .State
                .textLabelPairsArray.push({index: 0, label: 'Что влияло на мое состояние на этой неделе?\n(как в позитивном, так и в негативном ключе)', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Orbits:
                groupedByNumber[sprintReplyNumber]
                .cards
                .Orbits
                .textLabelPairsArray.push({index: 0, label: 'Каким образом в моем поведении на этой неделе проявлялись орбиты? Как я выруливал(а)?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            case ReflectionAnswerTypeEnum.Correction:
                groupedByNumber[sprintReplyNumber]
                .cards
                .Correction
                .textLabelPairsArray.push({index: 0, label: 'Что я изменю на следующей неделе?', text: [].concat(answer.split('\n').filter(answ => answ.length > 0))});
                break;
            default:
                // Если вдруг появится новый тип, сюда попадет ошибка
                { const exhaustiveCheck: never = answerType;
                throw new Error(`Unhandled answerType: ${exhaustiveCheck}`); }
        }
    });

    return groupedByNumber;
    }
    return undefined
}
