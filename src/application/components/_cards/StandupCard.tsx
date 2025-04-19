import './StandupCardStyle.css';

type StandupCardProps = {
    date: Date
};


function StandupCard({
    date
}: StandupCardProps) {
    return (
        <div className='standup-card'>
        <div className='standup-card__date-container'>
            {date.toDateString()}
        </div>
        <div className='standup-card__mental-states-container'>
            <div className='standup-card__mental-states-container__mental-state'>
                Перевозбуждение
            </div>
            <div className='standup-card__mental-states-container__mental-state'>
                Перевозбуждение
            </div>
            <div className='standup-card__mental-states-container__mental-state'>
                Перевозбуждение
            </div>
        </div>
        <div className='standup-card__win-container'>
            Допустим это очень длинный текст который никуда не влезет что будет делать сетка а а а а а а а
        </div>
        <div className='standup-card__tabs-container'>
            <div className='standup-card__tabs-container__tab tab-type_life'>
            </div>
            <div className='standup-card__tabs-container__tab tab-type_fun'>
            </div>
            <div className='standup-card__tabs-container__tab tab-type_drive'>
            </div>
        </div>
    </div>
    );
}

export default StandupCard;