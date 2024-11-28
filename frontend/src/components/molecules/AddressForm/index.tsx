import CustomButton from '@atoms/CustomButton';
import TextInput from '@atoms/TextInput';
import useProfile from '@customHooks/useProfile';
import { IUserAddress } from '@interface/user';
import { useAppSelector } from '@store';
import React, { useContext, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import style from './index.module.scss';

interface IAddressForm {
    addressDetails?: IUserAddress;
    successCallback?: (addressId?: string) => void;
    isEditMode?: boolean;
}

const AddressForm = (props: IAddressForm) => {
    const { addressDetails, successCallback, isEditMode = false } = props;

    const {
        control,
        reset,
        handleSubmit,
        watch,
        formState: { isDirty, dirtyFields },
    } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { handleAddAddress, handleUpdateAddress } = useProfile();
    const { userId, firstName, lastName, mobileNo } = useAppSelector((state) => state.userProfile);

    const handleFormSubmit = async (formValues: any) => {
        if (isEditMode) {
            if (isDirty && userId && addressDetails?._id) {
                const valuesToUpdate: any = {};
                Object.keys(dirtyFields).forEach((field: string) => {
                    valuesToUpdate[field] = formValues[field];
                });
                const res = await handleUpdateAddress({
                    userId,
                    addressId: addressDetails._id,
                    valuesToUpdate,
                });

                if (res?.status) successCallback?.(addressDetails._id);
            } else successCallback?.();
        } else {
            if (userId) {
                const userDetails = watch('otherRecipient') ? {} : { firstName, lastName, mobileNo };
                const res = await handleAddAddress({ userId, address: { ...userDetails, ...formValues } });

                if (res?.status && res?.responseBody?.addressId) successCallback?.(res?.responseBody?.addressId);
            }
        }
    };

    useEffect(() => {
        if (addressDetails) reset({ ...addressDetails, otherRecipient: true });
    }, [addressDetails]);

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <Row className="mb-3">
                {!isEditMode && (
                    <Col xs={12} className="mb-3">
                        <Controller
                            control={control}
                            name="otherRecipient"
                            render={({ field: { value, onChange } }) => (
                                <Form.Check
                                    type="checkbox"
                                    label="Ordering for someone else?"
                                    value={value}
                                    onChange={onChange}
                                    className={style.customCheckbox}
                                />
                            )}
                        />
                    </Col>
                )}
                {watch('otherRecipient') && (
                    <>
                        <Col lg={6} className="mb-4">
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
                        <Col lg={6} className="mb-4">
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
                        <Col lg={6} className="mb-4">
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
                    </>
                )}
                <Col lg={6} className="mb-4">
                    <Controller
                        control={control}
                        name="pincode"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="Pincode"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={6} className="mb-4">
                    <Controller
                        control={control}
                        name="houseNo"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="House No."
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={6} className="mb-4">
                    <Controller
                        control={control}
                        name="streetAddress"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="Street Address"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={6} className="mb-4">
                    <Controller
                        control={control}
                        name="city"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="City"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
                <Col lg={6} className="mb-4">
                    <Controller
                        control={control}
                        name="state"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                placeholder="State"
                                controlProps={{ value }}
                                onChange={onChange}
                                error={error?.message}
                            />
                        )}
                    />
                </Col>
            </Row>
            <div className="flex">
                <CustomButton variant="secondary" type="submit" className="px-5">
                    {dictionary?.submitLabel}
                </CustomButton>
                <CustomButton variant="link" className="mx-3" onClick={() => successCallback?.()}>
                    {dictionary?.cancelLabel}
                </CustomButton>
            </div>
        </Form>
    );
};

export default AddressForm;
