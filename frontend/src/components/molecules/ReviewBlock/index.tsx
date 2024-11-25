import React from 'react';
import style from './index.module.scss';
import ProductRatings from '@atoms/ProductRatings';
import {
    addMinutes,
    differenceInYears,
    format,
    formatISO,
    fromUnixTime,
    getTime,
    getUnixTime,
    isValid,
    parse,
    toDate,
} from 'date-fns';

interface IReviewBlock {
    customerName?: string;
    ratings?: number;
    reviewDate?: Date;
    feedback?: string;
}

const ReviewBlock = (props: IReviewBlock) => {
    const { ratings = -1, customerName, reviewDate, feedback } = props;

    return (
        <div className={style.singleReview}>
            <div className={style.reviewHeader}>
                <h6>{customerName}</h6>
                <ProductRatings ratings={ratings} />
            </div>
            {reviewDate && <span className={style.date}>{format(reviewDate, 'LLL dd, yyyy')}</span>}
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default ReviewBlock;
