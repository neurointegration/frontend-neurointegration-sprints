import { Icons, IconPosition } from '../_types/Icons';
import { FontSize } from '../_types/Fonts';
import { clsx } from 'clsx';
import './Button.css';
import { SyntheticEvent } from 'react';

type ButtonProps = {
    showMode: 'common' | 'filled' | 'outlined';
    size?: 'normal' | 'small';
    icon?: Icons;
    caption?: string;
    fontSize?: FontSize;
    iconPosition?: IconPosition;
    onClick: (event: SyntheticEvent) => void;
};

function Button({
    showMode = 'common',
    size = 'normal',
    icon,
    caption,
    fontSize,
    iconPosition = 'left',
    onClick
}: ButtonProps) {
    const buttonCN = clsx(
        'controls-button',
        icon && 'controls-button_icon',
        `controls-button_${size}-size`,
        `controls-button_${showMode}-showMode`
    );

    const captionCN = clsx(
        'controls-button__caption',
        fontSize && `controls-font_size-${fontSize}`
    );

    const iconIMG = <img src={icon} />;
    return (
        <button onClick={onClick} className={buttonCN}>
            {icon && iconPosition === 'left' && iconIMG}

            <div className={captionCN}>{caption}</div>

            {icon && iconPosition === 'right' && iconIMG}
        </button>
    );
}

export default Button;
