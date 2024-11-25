import React from 'react';
import style from './index.module.scss';
import cx from 'classnames';

interface IProductRatings {
    ratings?: number;
    className?: string;
}

const ProductRatings = (props: IProductRatings) => {
    const { ratings = 0, className } = props;

    const getIcon = (index: number) => {
        if (ratings >= index + 1) return 'star-filled';
        if (ratings > 0 && ratings > index && ratings < index + 1) return 'star-half';
        else return 'star';
    };

    return (
        <span className={cx(style.stars, className)}>
            {[...Array(5)].map((_item: any, index: number) => (
                <i className={`font icon-${getIcon(index)}`}></i>
            ))}
        </span>
    );
};

export default ProductRatings;
