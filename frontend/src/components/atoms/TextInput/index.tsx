import React from 'react';
import style from './index.module.scss';
import { Form, FormControl } from 'react-bootstrap';

interface ITextInput {
    placeholder?: string;
    onChange: React.ChangeEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    error?: string;
    className?: string;
    type?: string;
    disabled?: boolean;
    controlProps?: { [key: string]: string | number };
    icon?: string;
    onIconClick?: () => void;
}

const TextInput = (props: ITextInput) => {
    const {
        placeholder,
        type = 'text',
        onChange,
        onKeyDown,
        error,
        className = '',
        disabled = false,
        controlProps,
        icon,
        onIconClick,
    } = props;

    const { value = '', ...restProps } = controlProps || {};

    return (
        <div
            className={`${style.inputWrapper} ${error ? style.invalid : ''} ${
                disabled ? style.disabled : ''
            } ${className}`}
        >
            <Form.Control
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={value}
                type={type}
                autoComplete="off"
                {...restProps}
            ></Form.Control>
            {icon && <i className={`font icon-${icon} ${style.icon}`} onClick={onIconClick}></i>}
            {error && (
                <FormControl.Feedback className={style.error} type="invalid">
                    {error}
                </FormControl.Feedback>
            )}
        </div>
    );
};

export default TextInput;
