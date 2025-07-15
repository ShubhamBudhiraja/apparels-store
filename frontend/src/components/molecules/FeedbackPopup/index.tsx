import RatingStars from '@atoms/RatingStars';
import TextInput from '@atoms/TextInput';
import OverlayWrapper from '@molecules/OverlayWrapper';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import style from './index.module.scss';
import { Button, Form } from 'react-bootstrap';
import ordersApiHandler from 'api-managers/services/orders';

interface IFeedbackPopup {
    show?: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    userId?: string;
    orderId: string;
}

const FeedbackPopup = (props: IFeedbackPopup) => {
    const { show = false, setShow, userId, orderId } = props;

    const { submitOrderFeedback } = ordersApiHandler();
    const { control, handleSubmit } = useForm();

    const handleFormSubmit = async (formValues: any) => {
        if (userId) {
            const payload = {
                userId,
                orderId,
                rating: formValues.rating + 1,
                description: formValues.comment,
            };
            const res = await submitOrderFeedback(payload);
        }
    };

    return (
        <OverlayWrapper
            show={show}
            onHide={() => setShow(false)}
            heading="Rate your journey with us!"
            headerProps={{ className: style.customPopupHeader }}
            modalProps={{ dialogClassName: style.popupWrap }}
            bodyClassName="pt-2"
        >
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Controller
                    name="rating"
                    rules={{ required: 'Please submit rating' }}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <div className="mb-4">
                            <RatingStars activeIndex={value} handleStarClick={(index: number) => onChange(index)} />
                        </div>
                    )}
                />
                <Controller
                    name="comment"
                    rules={{ required: 'Please submit rating' }}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            className="mb-4"
                            placeholder="Comments"
                            onChange={onChange}
                            controlProps={{ value, rows: 4 }}
                            textarea
                        />
                    )}
                />
                <Button variant="secondary" className="d-block m-auto w-50" type="submit">
                    Submit
                </Button>
            </Form>
        </OverlayWrapper>
    );
};

export default FeedbackPopup;
