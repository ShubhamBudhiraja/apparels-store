import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import { IFormData } from 'src/lib/interface/common';
import style from './index.module.scss';
import TextInput from '@atoms/TextInput';
import CustomButton from '@atoms/CustomButton';
import { VALIDATIONS } from '@utils/validations';
import useAuthApi from 'api-managers/services/auth';
import { useAppDispatch, useAppSelector } from 'src/lib/store';
import { LoginModalActions } from 'src/lib/store/reducers/loginModalSlice';
import useProfile from '@customHooks/useProfile';

interface ISignupForm {
    formData?: IFormData[];
}

const SignupForm = (props: ISignupForm) => {
    const { formData } = props;

    const { control, handleSubmit, formState, reset } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { signUp, validateOtp } = useAuthApi();
    const { storeUser } = useProfile();
    const { onSuccess } = useAppSelector((state) => state.loginModal);
    const dispatch = useAppDispatch();

    const [step, setStep] = useState(1);

    const resetForm = () => {
        setStep(1);
        reset({ emailId: '', password: '' });
    };

    const handleSignupSubmit = async (formValues: any) => {
        if (step === 1) {
            const emailRes = await signUp({ userId: formValues?.emailId, password: formValues?.password });

            if (emailRes?.status) {
                setStep(2);
            }
        } else {
            const otpRes = await validateOtp({
                userId: formValues?.emailId,
                otp: formValues?.otp,
                screenType: 'register',
            });

            if (otpRes?.status) {
                dispatch(LoginModalActions.updateModalState({ show: false }));
                const profileRes = await storeUser({ userId: formValues?.emailId });

                if (profileRes) {
                    onSuccess?.();
                }
            }
        }
    };

    return (
        <Form className={style.formWrapper} onSubmit={handleSubmit(handleSignupSubmit)} key="signup">
            <Controller
                control={control}
                name="emailId"
                rules={{
                    required: dictionary?.requiredFieldError,
                    pattern: { value: VALIDATIONS.EMAIL, message: dictionary?.invalidEmail },
                }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <TextInput
                        placeholder={formData?.[0]?.placeholder}
                        controlProps={{ value: value }}
                        onChange={onChange}
                        error={error?.message}
                        className={style.customInput}
                        disabled={step === 2}
                    />
                )}
            />

            {step === 1 && (
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: dictionary?.requiredFieldError }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <TextInput
                            type="password"
                            placeholder={formData?.[1]?.placeholder}
                            controlProps={{ value: value }}
                            onChange={onChange}
                            error={error?.message}
                            className={style.customInput}
                        />
                    )}
                />
            )}
            {step === 2 && (
                <Controller
                    control={control}
                    name="otp"
                    rules={{ required: dictionary?.requiredFieldError }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <TextInput
                            placeholder={formData?.[2]?.placeholder}
                            controlProps={{ value: value }}
                            onChange={onChange}
                            error={error?.message}
                            className={style.customInput}
                            type="tel"
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
                {step === 1 ? dictionary?.continueLabel : dictionary?.submitLabel}
            </CustomButton>
            {step === 2 && (
                <CustomButton variant="link" className={style.secondaryBtn} onClick={resetForm}>
                    {dictionary?.cancelLabel}
                </CustomButton>
            )}
        </Form>
    );
};

export default SignupForm;
