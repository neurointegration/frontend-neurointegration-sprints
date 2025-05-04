import clsx from 'clsx';
import './StandupCardStyle.css';

type MentalStateType = {
    text: string;
    colorClass: string;
}

export type StandupCardProps = {
    sprintNumber: number;
    date: string;
    mentalStates: MentalStateType[];
    wins: string[];
    focusLife: string[];
    focusFun: string[];
    focusDrive: string[];
};


function StandupCard({
    date,
    mentalStates,
    wins,
    focusLife,
    focusFun,
    focusDrive,
}: StandupCardProps) {
    const mentalStateItemCN = 'standup-card__mental-states-container__mental-state ';
    const mentalStatesItems = mentalStates.map((item) => <div className={clsx(mentalStateItemCN + item.colorClass)}>{item.text}</div>)
    const winsItems = wins.map((item) => <li>{item}</li>)
    const focusLifeItems = focusLife.map((item) => <p>{item}</p>)
    const focusFunItems = focusFun.map((item) => <p>{item}</p>)
    const focusDriveItems = focusDrive.map((item) => <p>{item}</p>)

    return (
        <div className='standup-card'>
        <div className='standup-card__date-container'>
            {date.split('-').reverse().join('.')}
        </div>
        <div className='standup-card__mental-states-container'>
            {mentalStatesItems}
        </div>
        <div className='standup-card__win-container'>
            <p className='standup-card__label'>победа</p>
            <ul className='standup-card__win-container__list'>
                {winsItems}
            </ul>
        </div>
        <div className='standup-card__focus'>
            <p className='standup-card__label'>фокус</p>
            <div className='standup-card__focus__tabs-container'>
                <div className='focus__tab tab-type_life'>
                    <p className='standup-card__focus__tabs-container__label'>лайф</p>
                    {focusLifeItems}
                </div>
                <div className='focus__tab tab-type_fun'>
                    <p className='standup-card__focus__tabs-container__label'>кайф</p>
                    {focusFunItems}                  
                </div>
                <div className='focus__tab tab-type_drive'>
                    <p className='standup-card__focus__tabs-container__label'>драйв</p>
                    {focusDriveItems}
                </div>
            </div>
        </div>
    </div>
    );
}

export default StandupCard;


