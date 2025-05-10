import { StandupCardProps } from "../../../application/components/_cards/StandupCard";
import { StandupAnswerTypeEnum } from "../../../Platform/_types/AnswerTypes";
import { StandupResponseType } from "../actions/standup";


const mentalStatesColors = new Map <string, string> (
    [
        ["Паника", "state-color-red"],
        ["Перевозбуждение", "state-color-orange"],
        ["Включенность", "state-color-yellow"],
        ["Баланс", "state-color-warm-green"],
        ["Расслабленность", "state-color-cold-green"],
        ["Пассивность", "state-color-blue"],
        ["Апатия", "state-color-purple"],
    ]
);

export function transformStandups(
    responses: StandupResponseType[]
): StandupCardProps[] {
    const groupedByDate: Record<string, StandupCardProps> = {};

    if (responses) {

    responses.forEach((response) => {
        const { date, sprintNumber, answerType, answer } = response;

        if (!groupedByDate[date]) {
            groupedByDate[date] = {
                sprintNumber,
                date,
                mentalStates: [],
                wins: [],
                focusLife: [],
                focusFun: [],
                focusDrive: [],
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
                card.focusLife = (card.focusLife.concat(answer.split('\n').filter(answ => answ.length > 0)));
                break;
            case StandupAnswerTypeEnum.EveningStandUpPleasure:
                card.focusFun = (card.focusFun.concat(answer.split('\n').filter(answ => answ.length > 0)));
                break;
            case StandupAnswerTypeEnum.EveningStandUpDrive:
                card.focusDrive = (card.focusDrive.concat(answer.split('\n').filter(answ => answ.length > 0)));
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
