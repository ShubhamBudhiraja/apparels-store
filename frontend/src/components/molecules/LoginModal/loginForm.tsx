import TextInput from '@atoms/TextInput';
import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import { IFormData } from 'src/lib/interface/common';
import style from './index.module.scss';

interface ILoginForm {
    formData?: IFormData[];
    forgotPswdTxt?: string;
}

const LoginForm = (props: ILoginForm) => {
    const { formData, forgotPswdTxt } = props;

    const { control, handleSubmit } = useForm();
    const { dictionary } = useContext(LayoutContextData);

    const handleLoginSubmit = async (formValues: any) => {
        console.log(formValues, 'formvalues');
    };

    return (
        <Form className={style.formWrapper} onSubmit={handleSubmit(handleLoginSubmit)}>
            {formData?.[0]?.id && (
                <Controller
                    control={control}
                    name={formData?.[0]?.id}
                    rules={{ required: dictionary?.requiredFieldError }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <TextInput
                            placeholder={formData?.[0]?.placeholder}
                            controlProps={{ value: value }}
                            onChange={onChange}
                            error={error?.message}
                            className={style.customInput}
                        />
                    )}
                />
            )}
            {formData?.[1]?.id && (
                <Controller
                    control={control}
                    name={formData?.[1]?.id}
                    rules={{ required: dictionary?.requiredFieldError }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <TextInput
                            placeholder={formData?.[1]?.placeholder}
                            controlProps={{ value: value }}
                            onChange={onChange}
                            error={error?.message}
                            className={style.customInput}
                        />
                    )}
                />
            )}
            <Button variant="secondary" className={style.submitBtn} type="submit">
                {dictionary?.submitLabel}
            </Button>
            <Button variant="link" className={style.secondaryBtn}>
                {forgotPswdTxt}
            </Button>
        </Form>
    );
};

export default LoginForm;
