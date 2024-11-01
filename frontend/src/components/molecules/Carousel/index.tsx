import React from 'react';
import Slider, { Settings } from 'react-slick';
import { DefaultSliderSettings } from 'src/lib/constants/slider';

interface ICarousel {
    children: any;
    settings?: Settings;
}

const Carousel = (props: ICarousel) => {
    const { settings, children } = props;

    return (
        <Slider {...DefaultSliderSettings} {...settings}>
            {children}
        </Slider>
    );
};

export default Carousel;
