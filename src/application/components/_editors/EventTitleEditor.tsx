import './EventTitleEditorStyle.css';
import { EventType } from '../_cards/_types/EventCardType';
import TextInput from '../../../Platform/_inputs/TextInput';

type EventTitleEditorProps = {
    useTitle: [
        string | null,
        React.Dispatch<React.SetStateAction<string | null>>
    ];
    eventType: EventType;
    disabled?: boolean;
};

function EventTitleEditor({
    useTitle: [title, setTitle],
    eventType,
    disabled,
}: EventTitleEditorProps) {
    const baseCN = 'eventTitleEditor';

    return (
        <div className={baseCN}>
            <span>
                {eventType === EventType.Project
                    ? 'Название проекта'
                    : 'Название задачи'}
            </span>
            <TextInput
                useValue={[title, setTitle]}
                multiline
                disabled={disabled}
            />
        </div>
    );
}

export default EventTitleEditor;
