import React from 'react';
import style from './index.module.scss';
import { FormControl } from 'react-bootstrap';

interface ITextInput {
    placeholder?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    value?: string;
    className?: string;
}

const TextInput = (props: ITextInput) => {
    const { placeholder, onChange, error, value, className = '' } = props;

    return (
        <div className={`${style.inputWrapper} ${className}`}>
            <input placeholder={placeholder} onChange={onChange} value={value}></input>
            {error && (
                <FormControl.Feedback className={style.error} type="invalid">
                    {error}
                </FormControl.Feedback>
            )}
        </div>
    );
};

export default TextInput;
