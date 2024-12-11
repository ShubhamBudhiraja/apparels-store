import React from 'react';
import style from './index.module.scss';
import { Form, FormControl } from 'react-bootstrap';

interface ITextInput {
    placeholder?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    className?: string;
    type?: string;
    disabled?: boolean;
    controlProps?: { value: string; [key: string]: string | number };
}

const TextInput = (props: ITextInput) => {
    const { placeholder, type = 'text', onChange, error, className = '', disabled = false, controlProps } = props;

    const { value, ...restProps } = controlProps || {};

    return (
        <div
            className={`${style.inputWrapper} ${error ? style.invalid : ''} ${
                disabled ? style.disabled : ''
            } ${className}`}
        >
            <Form.Control
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                type={type}
                {...restProps}
            ></Form.Control>
            {error && (
                <FormControl.Feedback className={style.error} type="invalid">
                    {error}
                </FormControl.Feedback>
            )}
        </div>
    );
};

export default TextInput;
