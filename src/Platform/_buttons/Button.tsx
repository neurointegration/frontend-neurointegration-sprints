import { Icons, IconPosition } from '../_types/Icons';
import { FontSize } from '../_types/Fonts';
import { clsx } from 'clsx';
import './Button.css';
import { SyntheticEvent } from 'react';

type ButtonProps = {
    showMode?: 'common' | 'filled' | 'outlined';
    size?: 'normal' | 'small';
    icon?: Icons;
    caption?: string;
    fontSize?: FontSize;
    iconPosition?: IconPosition;
    className?: string;
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
    onClick?: (event: SyntheticEvent) => void;
    id?: string;
};

function Button({
    id='',
    showMode = 'common',
    size = 'normal',
    icon,
    caption,
    fontSize,
    iconPosition = 'left',
    className,
    disabled = false,
    type,
    onClick,
}: ButtonProps) {
    const buttonCN = clsx(
        'controls-button',
        icon && 'controls-button_icon',
        `controls-button_${size}-size`,
        `controls-button_${showMode}-showMode`,
        className && className
    );

    const captionCN = clsx(
        'controls-button__caption',
        fontSize && `controls-fontsize-${fontSize}`
    );

    const iconIMG = <img aria-hidden src={icon} />;
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonCN}
            id={id}
        >
            {icon && iconPosition === 'left' && iconIMG}

            <div className={captionCN}>{caption}</div>

            {icon && iconPosition === 'right' && iconIMG}
        </button>
    );
}

export default Button;
