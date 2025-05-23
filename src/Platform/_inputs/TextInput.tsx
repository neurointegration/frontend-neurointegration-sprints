import clsx from 'clsx';
import './TextInputStyle.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useWindowDimensions from './_hooks/useWindowDimentions';

type TextInputProps = {
    id?: string;
    useValue: [
        string | null,
        React.Dispatch<React.SetStateAction<string | null>>
    ];
    onChange?: (
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => void;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
    disabled?: boolean;
    notifier?: {
        propertyChanged: (propertyKey: string, newValue: string) => void;
        propertyKey: string;
    };
    allowEmpty?: boolean;
    required?: boolean;
    onEmptyChange?: (isEmpty: boolean) => void;
};

/**
 * Однострочный компонент редактирование текстового ввода.
 * При фокусе перемещает каретку в конец
 * @param useValue Хук-стейт значения (значение и его сеттер)
 * @param className Класс, навешиваемвый на корень
 * @returns
 */
function TextInput({
    id = '',
    useValue: [value, setValue],
    onChange,
    className,
    multiline = false,
    placeholder,
    disabled,
    notifier,
    allowEmpty = false,
    required = false,
    onEmptyChange,
}: TextInputProps) {
    const [empty, setEmpty] = useState<boolean>(false);

    const baseCN = 'controls-textInput';
    const wrapperCN = clsx(baseCN, className && className);
    const inputCN = clsx(`${baseCN}__input`, empty && `${baseCN}__input_empty`);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const windowDimentions = useWindowDimensions();

    useEffect(() => {
        if (multiline && textAreaRef) {
            _changeAreaHeight(textAreaRef, multiline);
        }
    }, [windowDimentions, multiline, value]);

    const changeHandler = (
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        _changeAreaHeight(textAreaRef, multiline);
        const newVal = event.target.value;

        setValue(() => {
            notifier?.propertyChanged(notifier.propertyKey, newVal);

            return newVal;
        });

        if (!allowEmpty) {
            setEmpty(() => {
                onEmptyChange?.(!newVal.length);
                return !newVal.length;
            });
        }

        onChange?.(event);
    };

    const focusHandler = (event: {
        target: {
            setSelectionRange: (start: number, end: number) => void;
            scrollLeft: number;
            scrollWidth: number;
        };
    }) => {
        setTimeout(() => {
            event.target.setSelectionRange(value?.length, value?.length);
            event.target.scrollLeft = event.target.scrollWidth;
        }, 0);
    };

    const renderEl = multiline ? (
        <textarea
            id={id}
            disabled={disabled}
            placeholder={placeholder || ''}
            ref={textAreaRef}
            rows={1}
            className={inputCN}
            value={value}
            onFocus={focusHandler}
            onChange={changeHandler}
            required={required}
        />
    ) : (
        <input
            id={id}
            disabled={disabled}
            placeholder={placeholder || ''}
            type='text'
            className={inputCN}
            value={value}
            onFocus={focusHandler}
            onChange={changeHandler}
            required={required}
        />
    );

    return (
        <div className={wrapperCN}>
            {renderEl}
            {/* {empty && (
                <div className={hintCN}>Значение не может быть пустым!</div>
            )} */}
        </div>
    );
}

const _changeAreaHeight = (
    area: React.MutableRefObject<HTMLTextAreaElement>,
    multiline: boolean
) => {
    if (area && multiline) {
        area.current.style.height = 'auto';
        area.current.style.height = area.current.scrollHeight + 1 + 'px';
    }
};

export default TextInput;
