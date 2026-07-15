'use client';
import SectionHeader from '@atoms/SectionHeader';
import TextInput from '@atoms/TextInput';
import { useAppSelector } from '@store';
import React, { useContext, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import style from './index.module.scss';
import CustomButton from '@atoms/CustomButton';
import useProfile from '@customHooks/useProfile';

const MyProfile = () => {
    const { control, reset, handleSubmit, formState } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const userDetails = useAppSelector((state) => state.userProfile);
    const { handleUpdateProfile } = useProfile();

    useEffect(() => {
        reset({
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
            mobileNo: userDetails?.mobileNo,
            emailId: userDetails?.emailId || userDetails?.userId,
        });
    }, [userDetails, reset]);

    const onSubmit = async (formValues: {
        firstName?: string;
        lastName?: string;
        mobileNo?: string;
    }) => {
        if (!userDetails?.userId) return;

        await handleUpdateProfile(userDetails.userId, {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            mobileNo: formValues.mobileNo,
        });
    };

    return (
        <section className={style.formWrap}>
            <SectionHeader heading="Edit Profile Details" />
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col lg={5} className="mb-4">
                        <Controller
                            name="firstName"
                            rules={{ required: dictionary?.requiredFieldError }}
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextInput
                                    placeholder="First Name"
                                    onChange={onChange}
                                    controlProps={{ value }}
                                    error={error?.message}
                                />
                            )}
                        />
                    </Col>
                    <Col lg={5} className="mb-4">
                        <Controller
                            name="lastName"
                            rules={{ required: dictionary?.requiredFieldError }}
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextInput
                                    placeholder="Last Name"
                                    onChange={onChange}
                                    controlProps={{ value }}
                                    error={error?.message}
                                />
                            )}
                        />
                    </Col>
                    <Col lg={5} className="mb-4">
                        <Controller
                            name="emailId"
                            rules={{ required: dictionary?.requiredFieldError }}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <TextInput
                                    disabled
                                    placeholder="Email ID"
                                    onChange={onChange}
                                    controlProps={{ value }}
                                />
                            )}
                        />
                    </Col>
                    <Col lg={5} className="mb-4">
                        <Controller
                            name="mobileNo"
                            rules={{ required: dictionary?.requiredFieldError }}
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <TextInput
                                    placeholder="Mobile Number"
                                    onChange={onChange}
                                    controlProps={{ value }}
                                    error={error?.message}
                                />
                            )}
                        />
                    </Col>
                    <Col lg={3}>
                        <CustomButton
                            variant="secondary"
                            className="w-100"
                            type="submit"
                            loading={formState.isSubmitting}
                        >
                            Update
                        </CustomButton>
                    </Col>
                </Row>
            </Form>
        </section>
    );
};

export default MyProfile;
