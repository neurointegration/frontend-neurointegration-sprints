import { ReflectionRegistryProps } from "../../../application/components/_registry/ReflectionRegistry";
import { StandupAnswerTypeEnum } from "../../../Platform/_types/AnswerTypes";
import { ReflectionResponseType } from "../actions/reflection";

export enum ReflectionTypes {
    Regular = "regular",
    Integration = "integration"
}


export function transformReflections(
    responses: ReflectionResponseType[]
): ReflectionRegistryProps[] {
    const groupedByNumber: Record<number, ReflectionRegistryProps> = {};

    if (responses) {

    responses.forEach((response) => {
        const { answerNumber, answerType, answer } = response;

        if (!groupedByNumber[answerNumber]) {
            groupedByNumber[answerNumber] = {
                number : answerNumber,
                reflectionType : answerNumber != 3 ? ReflectionTypes.Regular : ReflectionTypes.Integration,
                cards : []
            };
        }

        const card = groupedByDate[date];

        switch (answerType) {
            case StandupAnswerTypeEnum.State:
                card.mentalStates.push({text : answer, colorClass : mentalStatesColors.get(answer)});
                break;
            case StandupAnswerTypeEnum.EveningStandUpWinnings:
                card.wins = (card.wins.concat(answer.split('\n').filter(answ => answ.length > 0)));
                break;
            case StandupAnswerTypeEnum.EveningStandUpLive:
                card.focusLife.push(answer);
                break;
            case StandupAnswerTypeEnum.EveningStandUpPleasure:
                card.focusFun.push(answer);
                break;
            case StandupAnswerTypeEnum.EveningStandUpDrive:
                card.focusDrive.push(answer);
                break;
            default:
                // Если вдруг появится новый тип, сюда попадет ошибка
                { const exhaustiveCheck: never = answerType;
                throw new Error(`Unhandled answerType: ${exhaustiveCheck}`); }
        }
    });

    return Object.values(groupedByDate);
    }
    return undefined
}
