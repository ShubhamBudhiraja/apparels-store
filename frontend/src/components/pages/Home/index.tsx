'use client';
import HomeBanner from '@molecules/HomeBanner';
import React, { useContext, useEffect, useState } from 'react';
import style from './index.module.scss';
import CollectionCard from '@molecules/CollectionCard';
import { Container } from 'react-bootstrap';
import SectionWrapper from '@atoms/SectionWrapper';
import ProductsCarousel from '@molecules/ProductsCarousel';
import SectionHeader from '@atoms/SectionHeader';
import { LayoutContextData } from 'src/lib/context/layout';
import useProductsAPI from 'api-managers/services/products';
import { ISingleSlide } from '@interface/common';

interface IHome {
    serverData?: any;
}

const Home = (props: IHome) => {
    const { serverData } = props;

    const { dictionary } = useContext(LayoutContextData);
    const { getProducts } = useProductsAPI();

    const [allProducts, setAllProducts] = useState([]);

    const initialiser = async () => {
        const res = await getProducts();
        if (res?.responseBody?.products) {
            setAllProducts(res?.responseBody?.products);
        }
    };

    useEffect(() => {
        initialiser();
    }, []);
    console.info("helo")

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
                {allProducts.length > 0 && (
                    <SectionWrapper>
                        <SectionHeader heading={dictionary?.newArrivalsLabel} className="text-center" />
                        <ProductsCarousel productsList={allProducts} />
                    </SectionWrapper>
                )}
            </Container>
        </>
    );
};

export default Home;
