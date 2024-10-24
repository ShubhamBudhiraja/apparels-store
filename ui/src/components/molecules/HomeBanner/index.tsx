import Carousel from '@molecules/Carousel';
import style from './index.module.scss';
import React, { useMemo } from 'react';
import { ISingleSlide } from 'src/lib/interface/common';
import { Container } from 'react-bootstrap';
import { Settings } from 'react-slick';

interface IHomeBanner {
    slides?: ISingleSlide[];
}

const HomeBanner = (props: IHomeBanner) => {
    const { slides } = props;

    const sliderSettings: Settings = useMemo(
        () => ({
            dots: true,
            fade: true,
            dotsClass: `${style.customDots} d-flex`,
        }),
        []
    );

    return (
        <div className={style.bannerWrapper}>
            <Carousel settings={sliderSettings}>
                {slides?.map((item: ISingleSlide, index: number) => (
                    <>
                        <div
                            className={style.singleSlide}
                            key={`homeslide_${index}`}
                            style={{ backgroundImage: `url(${item?.backgroundImage})` }}
                        >
                            <div className={style.content}>
                                <Container fluid>
                                    <span>{item?.subHeading}</span>
                                    <h2>{item?.heading}</h2>
                                    <p>{item?.description}</p>
                                    <a href={item?.buttonLink}>{item?.buttonText}</a>
                                </Container>
                            </div>
                        </div>
                    </>
                ))}
            </Carousel>
        </div>
    );
};

export default HomeBanner;
