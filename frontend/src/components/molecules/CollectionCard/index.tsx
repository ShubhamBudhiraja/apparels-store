import React from 'react';
import { ISingleSlide } from 'src/lib/interface/common';
import style from './index.module.scss';

const CollectionCard = (props: ISingleSlide) => {
    const { heading, buttonText, buttonLink, backgroundImage } = props;

    return (
        <div className={`${style.cardWrapper} flex-center`} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h3>{heading}</h3>
            <a href={buttonLink}>{buttonText}</a>
        </div>
    );
};

export default CollectionCard;
