import React, { useEffect, useState } from 'react';
import style from './index.module.scss';

interface IRatingStars {
    activeIndex?: number;
    handleStarClick: (index: number) => void;
}

const RatingStars = (props: IRatingStars) => {
    const { activeIndex = -1, handleStarClick } = props;

    const [activeStars, setActiveStars] = useState([...Array(5)].map(() => false));

    const handleStarColor = (hoverIndex: number) => {
        const temp = activeStars?.map((_, index: number) => index <= hoverIndex);
        setActiveStars(temp);
    };

    useEffect(() => {
        if (activeIndex) {
            handleStarColor(activeIndex);
        }
    }, [activeIndex]);

    return (
        <div className={style.wrapper}>
            {[...Array(5)].map((_, index: number) => (
                <i
                    className={`font icon-${activeStars[index] ? 'star-filled' : 'star'}`}
                    onMouseOver={() => handleStarColor(index)}
                    onMouseLeave={() => handleStarColor(activeIndex)}
                    onClick={() => handleStarClick(index)}
                ></i>
            ))}
        </div>
    );
};

export default RatingStars;
