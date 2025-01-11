import clsx from 'clsx';
import './TextInputStyle.css';
import { ChangeEvent, useEffect, useRef } from 'react';
import useWindowDimensions from './_hooks/useWindowDimentions';

type TextInputProps = {
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
};

/**
 * Однострочный компонент редактирование текстового ввода.
 * При фокусе перемещает каретку в конец
 * @param useValue Хук-стейт значения (значение и его сеттер)
 * @param className Класс, навешиваемвый на корень
 * @returns
 */
function TextInput({
    useValue: [value, setValue],
    onChange,
    className,
    multiline = false,
    placeholder,
    disabled,
}: TextInputProps) {
    const baseCN = 'controls-textInput';
    const wrapperCN = clsx(baseCN, className && className);
    const inputCN = clsx(`${baseCN}__input`);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const windowDimentions = useWindowDimensions();

    useEffect(() => {
        if (multiline && textAreaRef) {
            _changeAreaHeight(textAreaRef, multiline);
        }
    }, [windowDimentions, multiline]);

    const changeHandler = (
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        _changeAreaHeight(textAreaRef, multiline);
        setValue(() => event.target.value);

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
            disabled={disabled}
            placeholder={placeholder || ''}
            ref={textAreaRef}
            rows={1}
            className={inputCN}
            value={value}
            onFocus={focusHandler}
            onChange={changeHandler}
        />
    ) : (
        <input
            disabled={disabled}
            placeholder={placeholder || ''}
            type='text'
            className={inputCN}
            value={value}
            onFocus={focusHandler}
            onChange={changeHandler}
        />
    );

    return <div className={wrapperCN}>{renderEl}</div>;
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
