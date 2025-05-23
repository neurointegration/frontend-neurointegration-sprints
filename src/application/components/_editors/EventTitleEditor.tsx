import './EventTitleEditorStyle.css';
import { EventType } from '../_cards/_types/EventCardType';
import TextInput from '../../../Platform/_inputs/TextInput';
import { useContext } from 'react';
import { EditingScreenFormContext } from '../../screens/editing/EventEditingContext';
import React from 'react';

type EventTitleEditorProps = {
    useTitle: [
        string | null,
        React.Dispatch<React.SetStateAction<string | null>>
    ];
    eventType: EventType;
    disabled?: boolean;
    onEmptyChange?: (isEmpty: boolean) => void;
};

function EventTitleEditor({
    useTitle,
    eventType,
    disabled,
    onEmptyChange
}: EventTitleEditorProps) {
    const formContext = useContext(EditingScreenFormContext);
    const baseCN = 'eventTitleEditor';

    return (
        <div className={baseCN}>
            <label htmlFor='event-name'>
                {eventType === EventType.Project
                    ? 'Название проекта'
                    : 'Название задачи'}
            </label>
            <TextInput
                id = 'event-name'
                useValue={useTitle}
                notifier={{
                    propertyChanged: formContext.propertyChanged,
                    propertyKey: 'title',
                }}
                disabled={disabled}
                onEmptyChange={onEmptyChange}
                required
            />
        </div>
    );
}

export default React.memo(EventTitleEditor);
