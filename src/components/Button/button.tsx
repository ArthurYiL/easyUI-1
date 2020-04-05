import React from 'react';
import classNames from 'classnames';

export enum ButtonSize {
    Large = 'lg',
    Small = 'sm'
}

export enum ButtonType {
    Danger = 'danger',
    Default = 'default',
    Link = 'link',
    Primary = 'primary'
}

interface BaseButtonProps {
    children: React.ReactNode;
    btnType?: ButtonType;
    className?: string;
    disabled?: boolean;
    href?: string;
    size?: ButtonSize;
}

// Button component expects all native button and anchor HTML attributes
// Partial makes all these native props optional
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>;
export type ButtonProps = Partial<NativeButtonProps> & Partial<AnchorButtonProps>;

const Button: React.FC<ButtonProps> = props => {
    const {
        btnType,
        children,
        className,
        disabled,
        href,
        size,
        ...restProps
    } = props;

    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': (btnType === ButtonType.Link) && disabled
    });

    if (btnType === ButtonType.Link && href) {
        return (
            <a
                className={classes}
                href={href}
                {...restProps}
            >
                {children}
            </a>
        )
    } else {
        return (
            <button
                className={classes}
                disabled={disabled}
                {...restProps}
            >
                {children}
            </button>
        )
    }
};

Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default
};

export default Button;
