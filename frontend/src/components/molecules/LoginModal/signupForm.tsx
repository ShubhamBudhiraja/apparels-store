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
import { setStorageItem } from '@utils/storage';
import { STORAGE_KEY, STORAGE_TYPE } from '@enums/storage';
import useProfileApi from 'api-managers/services/profile';
import { UserDataActions } from 'src/lib/store/reducers/userProfileSlice';
import useLogin from 'src/lib/customHooks/useLogin';

interface ISignupForm {
    formData?: IFormData[];
}

const SignupForm = (props: ISignupForm) => {
    const { formData } = props;

    const { control, handleSubmit, formState, reset, watch } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { signUp, validateOtp } = useAuthApi();
    const { storeUser } = useLogin();
    const { getProfileData } = useProfileApi();
    const { onSuccess } = useAppSelector((state) => state.loginModal);
    const dispatch = useAppDispatch();

    const [step, setStep] = useState(1);

    const resetForm = () => {
        setStep(1);
        reset({ emailId: '', password: '' });
    };

    const handleSignupSubmit = async (formValues: any) => {
        if (step === 1) {
            const emailRes = await signUp({ email: formValues?.emailId, password: formValues?.password });

            if (emailRes?.status) {
                setStep(2);
            }
        } else {
            const otpRes = await validateOtp({
                email: formValues?.emailId,
                otp: formValues?.otp,
                screenType: 'register',
            });

            if (otpRes?.status) {
                const profileRes = await storeUser({ email: formValues?.emailId });

                if (profileRes) {
                    onSuccess?.();
                }
            }
        }
    };

    return (
        <Form className={style.formWrapper} onSubmit={handleSubmit(handleSignupSubmit)}>
            {formData?.[0]?.id && (
                <Controller
                    control={control}
                    name={formData?.[0]?.id}
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
            )}
            {formData?.[1]?.id && step === 1 && (
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
            {formData?.[2]?.id && step === 2 && (
                <Controller
                    control={control}
                    name={formData?.[2]?.id}
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
