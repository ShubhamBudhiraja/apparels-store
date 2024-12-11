import CustomButton from '@atoms/CustomButton';
import TextInput from '@atoms/TextInput';
import { formatPrice } from '@utils/common';
import { VALIDATIONS } from '@utils/validations';
import React, { useContext } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import style from './index.module.scss';
import { useAppSelector } from '@store';

interface ICart {
    total: number;
}

const Card = (props: ICart) => {
    const { total } = props;

    const { control, handleSubmit } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { userId } = useAppSelector((state) => state.userProfile);

    const handleCardPayment = async (formData: any) => {
        if (userId) {
            const payload = {
                userId,
                orderId: '',
                // cardDetails,
                shouldSaveCard: true,
                isSavedCard: false,
            };
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(handleCardPayment)} as={Row}>
                <Col lg={8}>
                    <Controller
                        control={control}
                        name="cardNumber"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={(e: any) => {
                                    const val = e?.target?.value?.replaceAll(' ', '');
                                    if (VALIDATIONS.NUMBER.test(val)) {
                                        let res = '';
                                        val.split('').forEach((element: string, index: number) => {
                                            if (index > 0 && index % 4 === 0) res = res + ' ' + element;
                                            else res = res + element;
                                        });
                                        onChange(res);
                                    } else onChange(value);
                                }}
                                placeholder="Card Number"
                                controlProps={{ value, maxLength: 19 }}
                                error={error?.message}
                                className="mb-4"
                                type="tel"
                            />
                        )}
                    />
                </Col>
                <Col lg={2}>
                    <Controller
                        control={control}
                        name="cardExpiryDate"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={onChange}
                                placeholder="MM/YY"
                                controlProps={{ value, maxLength: 5 }}
                                error={error?.message}
                                className="mb-4"
                                type="tel"
                            />
                        )}
                    />
                </Col>
                <Col lg={2}>
                    <Controller
                        control={control}
                        name="cvv"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={(e: any) => {
                                    if (e?.target?.value) {
                                        if (VALIDATIONS.NUMBER.test(e?.target?.value)) onChange(e);
                                        else onChange('');
                                    } else onChange('');
                                }}
                                placeholder="CVV"
                                controlProps={{ value, maxLength: 3 }}
                                error={error?.message}
                                className="mb-4"
                            />
                        )}
                    />
                </Col>
                <Col lg={12}>
                    <Controller
                        control={control}
                        name="nameOnCard"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={onChange}
                                placeholder="Name on Card"
                                controlProps={{ value }}
                                error={error?.message}
                                className="mb-4"
                            />
                        )}
                    />
                </Col>
                <Col lg={12}>
                    <Controller
                        control={control}
                        name="shouldSaveCard"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange } }) => (
                            <Form.Check
                                type="checkbox"
                                value={value}
                                onChange={onChange}
                                label="Save card details"
                                className="mb-4"
                            />
                        )}
                    />
                </Col>
                <Col lg={4}>
                    <CustomButton variant="secondary" className="w-100">
                        Pay {formatPrice(total)}
                    </CustomButton>
                </Col>
            </Form>
        </div>
    );
};

export default Card;
