'use client';
import HomeBanner from '@molecules/HomeBanner';
import React from 'react';

interface IHome {
    serverData?: any;
}

const Home = (props: IHome) => {
    const { serverData } = props;

    return <HomeBanner slides={serverData?.bannerSlides} />;
};

export default Home;
