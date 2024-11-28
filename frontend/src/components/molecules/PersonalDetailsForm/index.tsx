import CustomButton from '@atoms/CustomButton';
import TextInput from '@atoms/TextInput';
import useProfile from '@customHooks/useProfile';
import { useAppSelector } from '@store';
import React, { useContext, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';

interface IPersonalDetailsForm {
    isCheckout?: boolean;
    successCallback?: () => void;
}

const PersonalDetailsForm = (props: IPersonalDetailsForm) => {
    const { isCheckout, successCallback } = props;

    const { handleSubmit, control, reset, formState } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { handleUpdateProfile } = useProfile();
    const profileData = useAppSelector((state) => state.userProfile);

    const handleFormSubmit = async (formValues: any) => {
        if (profileData?.userId) {
            await handleUpdateProfile(profileData.userId, formValues);
            successCallback?.();
        }
    };

    useEffect(() => {
        if (profileData) {
            const { userId, firstName, lastName, mobileNo, dob } = profileData;
            reset({ userId, firstName, lastName, mobileNo, dob });
        }
    }, [profileData]);

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)} className="mb-5">
            <Row>
                <Col lg={isCheckout ? 8 : 6} className="mb-4">
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="First Name"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={isCheckout ? 8 : 6} className="mb-4">
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="Last Name"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={isCheckout ? 8 : 6} className="mb-4">
                    <Controller
                        control={control}
                        name="mobileNo"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="Mobile No."
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                {!isCheckout && (
                    <>
                        <Col lg={isCheckout ? 8 : 6} className="mb-4">
                            <Controller
                                control={control}
                                name="userId"
                                rules={{ required: dictionary?.requiredFieldError }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <TextInput
                                        placeholder="Email ID"
                                        controlProps={{ value }}
                                        onChange={onChange}
                                        error={error?.message}
                                        disabled
                                    />
                                )}
                            />
                        </Col>
                        <Col lg={isCheckout ? 8 : 6} className="mb-4">
                            <Controller
                                control={control}
                                name="dob"
                                rules={{ required: dictionary?.requiredFieldError }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <TextInput
                                        placeholder="Date of Birth"
                                        controlProps={{ value }}
                                        onChange={onChange}
                                        error={error?.message}
                                    />
                                )}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <div className="flex">
                <CustomButton variant="secondary" type="submit" className="px-5" loading={formState?.isSubmitting}>
                    {dictionary?.continueLabel}
                </CustomButton>
            </div>
        </Form>
    );
};

export default PersonalDetailsForm;
