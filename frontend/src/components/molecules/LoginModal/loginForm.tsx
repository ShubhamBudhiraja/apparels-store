import TextInput from '@atoms/TextInput';
import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import { IFormData } from 'src/lib/interface/common';
import style from './index.module.scss';
import useAuthApi from 'api-managers/services/auth';
import { LoginModalActions } from 'src/lib/store/reducers/loginModalSlice';
import { useAppDispatch, useAppSelector } from 'src/lib/store';
import useLogin from 'src/lib/customHooks/useLogin';
import CustomButton from '@atoms/CustomButton';

interface ILoginForm {
    formData?: IFormData[];
    forgotPswdTxt?: string;
}

const LoginForm = (props: ILoginForm) => {
    const { formData, forgotPswdTxt } = props;

    const { control, handleSubmit, formState } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { login } = useAuthApi();
    const dispatch = useAppDispatch();
    const { onSuccess } = useAppSelector((state) => state.loginModal);
    const { storeUser } = useLogin();

    const handleLoginSubmit = async (formValues: any) => {
        const res = await login({ userId: formValues?.emailId, password: formValues?.password });

        if (res?.status) {
            dispatch(LoginModalActions.updateModalState({ show: false }));
            const profileRes = await storeUser({ userId: formValues?.emailId });

            if (profileRes) {
                onSuccess?.({ userId: formValues?.emailId });
            }
        }
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
            <CustomButton
                variant="secondary"
                className={style.submitBtn}
                type="submit"
                loading={formState.isSubmitting}
            >
                {dictionary?.submitLabel}
            </CustomButton>
            <CustomButton variant="link" className={style.secondaryBtn}>
                {forgotPswdTxt}
            </CustomButton>
        </Form>
    );
};

export default LoginForm;
