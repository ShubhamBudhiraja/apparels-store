import React, { useContext } from 'react';
import style from './index.module.scss';
import { Button, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '@atoms/TextInput';
import { LayoutContextData } from 'src/lib/context/layout';
import { INewsletterForm } from 'src/lib/interface/layout';

const NewsletterForm = (props: INewsletterForm) => {
    const { fieldId, heading, description, placeholder, btnText } = props;

    const { handleSubmit, control } = useForm();
    const { dictionary } = useContext(LayoutContextData);

    const handleEmailSubmit = (values?: any) => {
        console.info(values);
    };

    return (
        <div className={style.newsletterForm}>
            <h3>{heading}</h3>
            <p>{description}</p>
            <Form onSubmit={handleSubmit(handleEmailSubmit)} className="flex">
                <Controller
                    control={control}
                    name={fieldId}
                    rules={{ required: dictionary?.requiredFieldError }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <TextInput
                            placeholder={placeholder}
                            onChange={onChange}
                            error={error?.message}
                            controlProps={{ value: value }}
                            className={style.customInput}
                        />
                    )}
                />
                <Button type="submit">{btnText}</Button>
            </Form>
        </div>
    );
};

export default NewsletterForm;
