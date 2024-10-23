'use client';
import HomeBanner from '@molecules/HomeBanner';
import React from 'react';
import style from './index.module.scss';
import { ISingleSlide } from 'src/lib/interface/common';
import CollectionCard from '@molecules/CollectionCard';
import { Container } from 'react-bootstrap';
import SectionWrapper from '@atoms/SectionWrapper';

interface IHome {
    serverData?: any;
}

const Home = (props: IHome) => {
    const { serverData } = props;

    return (
        <>
            <div className="mb-5">
                <HomeBanner slides={serverData?.bannerSlides} />
            </div>
            <Container>
                <SectionWrapper>
                    <div className={style.collectionsCards}>
                        {serverData?.collectionCards?.map((card: ISingleSlide, index: number) => (
                            <div className={style.single} key={`${card?.heading}_${index}`}>
                                <CollectionCard {...card} />
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            </Container>
        </>
    );
};

export default Home;
