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

const MyProfile = () => {
    const { control, reset } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const userDetails = useAppSelector((state) => state.userProfile);

    useEffect(() => {
        reset({
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
            mobileNo: userDetails?.mobileNo,
            emailId: userDetails?.userId,
        });
    }, [userDetails]);

    return (
        <section className={style.formWrap}>
            <SectionHeader heading="Edit Profile Details" />
            <Form>
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
                        <CustomButton variant="secondary" className="w-100" type="submit">
                            Update
                        </CustomButton>
                    </Col>
                </Row>
            </Form>
        </section>
    );
};

export default MyProfile;
