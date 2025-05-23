import './EventSectionEditorStyle.css';
import { useContext } from 'react';
import { EditingScreenFormContext } from '../../screens/editing/EventEditingContext';
import React from 'react';
import { MainSectionType } from '../../../Platform/_types/Statuses';

type EventSectionEditorProps = {
    useSection: [
        MainSectionType | null,
        React.Dispatch<React.SetStateAction<MainSectionType | null>>
    ];
    disabled?: boolean;
    onEmptyChange?: (isEmpty: boolean) => void;
};

function EventSectionEditor({
    useSection,
    disabled,
}: EventSectionEditorProps) {
    const formContext = useContext(EditingScreenFormContext);
    const baseCN = 'eventSectionEditor';

    return (
        <div className={baseCN}>
            <fieldset className='section-change'>
            <legend>
                Секция
            </legend>
                <label className='radio-label'>
                    <input
                        disabled={disabled}
                        type='radio'
                        name='role'
                        value='client'
                        checked={useSection[0] == 'Life'}
                        onChange={() => {
                            useSection[1]('Life');
                            formContext.propertyChanged('section', 'Life')
                        }}
                    />{' '}
                    Лайф
                </label>
                <label className='radio-label'>
                    <input
                        disabled={disabled}
                        type='radio'
                        name='role'
                        value='both'
                        checked={useSection[0] === 'Fun'}
                        onChange={() => {
                            useSection[1]('Fun');
                            formContext.propertyChanged('section', 'Fun')
                        }}
                    />{' '}
                    Кайф
                </label>
                <label className='radio-label'>
                    <input
                        disabled={disabled}
                        type='radio'
                        name='role'
                        value='both'
                        checked={useSection[0] === 'Drive'}
                        onChange={() => {
                            useSection[1]('Drive');
                            formContext.propertyChanged('section', 'Drive')
                        }}                    
                        />{' '}
                    Драйв
                </label>
            </fieldset>
        </div>
    );
}

export default React.memo(EventSectionEditor);
