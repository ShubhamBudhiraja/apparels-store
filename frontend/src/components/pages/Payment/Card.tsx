import CustomButton from '@atoms/CustomButton';
import TextInput from '@atoms/TextInput';
import { formatPrice } from '@utils/common';
import { VALIDATIONS } from '@utils/validations';
import React, { useContext, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { LayoutContextData } from 'src/lib/context/layout';
import { useAppSelector } from '@store';
import usePaymentApi from 'api-managers/services/payment';
import { useRouter } from 'next/navigation';
import { PAYMENT_METHOD_TYPE } from '@enums/payment';

interface ICart {
    total: number;
    orderId: string;
}

const Card = (props: ICart) => {
    const { total, orderId } = props;

    const { control, handleSubmit, formState } = useForm();
    const { dictionary } = useContext(LayoutContextData);
    const { userId } = useAppSelector((state) => state.userProfile);
    const { handleCardPayment, getCardInfo } = usePaymentApi();
    const router = useRouter();

    const [showCvv, setShowCvv] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleDateChange = (inputDate?: string) => {
        let temp = inputDate ? `${inputDate}` : '';
        if (temp[temp.length - 1] === '/' && temp.length !== 3) {
            temp = temp.substring(0, temp.length - 1);
        } else if (temp.length === 2 && inputDate?.length === 1) {
            temp += '/';
        } else if (temp.length == 2 && inputDate?.length == 3) {
            temp = temp.substring(0, temp.length - 1);
        }

        const parts = temp?.split('/');
        const month = parts?.[0];
        const year = parts?.[1];

        if (month && parseInt(month) > 12) {
            parts[0] = '12';
            temp = parts?.join('/');
        }

        const yearValidThrough = (new Date().getFullYear() + 20)?.toString()?.slice(-2);

        if (year && parseInt(year) > parseInt(yearValidThrough)) {
            parts[1] = yearValidThrough;
            temp = parts.join('/');
        }

        temp = temp.replace(
            /[^\d\/]|^[\/]*$/g,
            '' // To allow only digits and `/`
        );
        return temp;
    };

    const getCardDetails = async (cardBin: string) => {
        const res = await getCardInfo(cardBin);
        if (res?.status) setPaymentMethod(res?.responseBody?.brand);
    };

    const handlePayment = async (formData: any) => {
        if (userId) {
            const payload = {
                userId,
                orderId,
                cardDetails: {
                    cardNumber: formData.cardNumber,
                    paymentMethodType: PAYMENT_METHOD_TYPE.CARD,
                    paymentMethod: paymentMethod,
                    cardExpMonth: formData.cardExpiryDate.split('/')[0],
                    cardExpYear: formData.cardExpiryDate.split('/')[1],
                    cardSecurityCode: formData?.cvv,
                    nameOnCard: formData.nameOnCard,
                },
                shouldSaveCard: formData?.shouldSaveCard || false,
                isSavedCard: false,
                cvvRequired: true,
            };

            const res = await handleCardPayment(payload);

            if (res?.status) {
                router.push(res?.responseBody?.paymentUrl);
            }
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(handlePayment)} className="row">
                <Col lg={6}>
                    <Controller
                        control={control}
                        name="cardNumber"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={(e: any) => {
                                    const val = e?.target?.value?.replaceAll(' ', '');
                                    if (val.length === 9 && paymentMethod.length === 0) {
                                        getCardDetails(val.slice(0, 9));
                                    } else if (val.length < 8) setPaymentMethod('');

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
                <Col lg={3}>
                    <Controller
                        control={control}
                        name="cardExpiryDate"
                        rules={{ required: dictionary?.requiredFieldError }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <TextInput
                                onChange={(e: any) => {
                                    const val = handleDateChange(e?.target?.value);
                                    onChange(val);
                                }}
                                placeholder="MM/YY"
                                controlProps={{ value, maxLength: 5 }}
                                error={error?.message}
                                className="mb-4"
                                type="tel"
                            />
                        )}
                    />
                </Col>
                <Col lg={3}>
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
                                icon={value?.length ? (showCvv ? 'eye-slash' : 'eye') : undefined}
                                type={showCvv ? 'text' : 'password'}
                                onIconClick={() => setShowCvv(!showCvv)}
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
                    <CustomButton variant="secondary" className="w-100" type="submit" loading={formState.isSubmitting}>
                        Pay {formatPrice(total)}
                    </CustomButton>
                </Col>
            </Form>
        </div>
    );
};

export default Card;
