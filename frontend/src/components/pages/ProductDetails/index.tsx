'use client';
import useProductsAPI from 'api-managers/services/products';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Col, Container, FormControl, Row } from 'react-bootstrap';
import style from './index.module.scss';
import { formatPrice } from '@utils/common';
import { LayoutContextData } from 'src/lib/context/layout';
import { useAppSelector } from '@store';
import { IProductData } from '@interface/products';
import useProduct from '@customHooks/useProduct';
import useLogin from '@customHooks/useLogin';
import { ILoginModalSuccess } from '@interface/user';
import { CART_PRODUCT_OPERATION, VARIANT_ID } from '@enums/products';
import ProductRatings from '@atoms/ProductRatings';
import ReviewBlock from '@molecules/ReviewBlock';
import cx from 'classnames';
import ProductGallery from '@molecules/ProductGallery';
import SectionWrapper from '@atoms/SectionWrapper';
import SectionHeader from '@atoms/SectionHeader';
import ProductsCarousel from '@molecules/ProductsCarousel';
import { SIZE_LABELS } from 'src/lib/constants/product';
import CustomButton from '@atoms/CustomButton';
import CounterButton from '@atoms/CounterButton';
import SizeGuideModal from '@molecules/SizeGuideModal';

interface IProductDetails {
    productId: string;
    segment: string;
    serverData?: any;
}

const ProductDetails = (props: IProductDetails) => {
    const { productId, segment, serverData } = props;

    const { getProductDetails, getRelatedProducts } = useProductsAPI();
    const router = useRouter();
    const { handleAddToCart, handleUpdateCart } = useProduct();
    const { initiateLogin } = useLogin();
    const { dictionary } = useContext(LayoutContextData);
    const { userId, cart } = useAppSelector((state) => state.userProfile);

    const [productData, setProductData] = useState<any>();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [variantCount, setVariantCount] = useState(0);
    const [variantError, setVariantError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const isUnavailable = useMemo(() => {
        if (productData) {
            return productData?.variants?.every((item: any) => item?.units === 0);
        }
    }, [productData]);

    const fewPiecesMsg = useMemo(() => {
        if (productData && selectedVariant) {
            const found = productData?.variants?.find((item: any) => item?.id === selectedVariant);
            const msg = found?.units < 10 ? dictionary?.fewPiecesLabel?.replace('$', found?.units) : '';
            return msg;
        } else return '';
    }, [productData, selectedVariant, dictionary]);

    const cartBtnClick = async () => {
        if (productData?.variants?.length && !selectedVariant) {
            setVariantError(dictionary?.variantError);
            return;
        }
        setIsLoading(true);
        if (userId) await handleAddToCart({ userId, product: productData, selectedVariant });
        else
            initiateLogin({
                successCallback: (data?: ILoginModalSuccess) =>
                    handleAddToCart({
                        userId: data?.userId,
                        product: productData,
                        selectedVariant: selectedVariant,
                    }),
            });
        setIsLoading(false);
    };

    const handleUpdateQuantity = async (operation: CART_PRODUCT_OPERATION) => {
        setIsLoading(true);
        await handleUpdateCart({
            userId,
            product: productData,
            operation,
            selectedVariant: selectedVariant,
        });
        setIsLoading(false);
    };

    const initialiser = async () => {
        const productDetails = await getProductDetails(productId, segment);
        if (productDetails?.status) {
            const prodData = productDetails?.responseBody;
            setProductData(prodData);
            if (prodData?.variants?.length === 1 && prodData?.variants?.[0]?.id === VARIANT_ID.DEFAULT)
                setSelectedVariant(VARIANT_ID.DEFAULT);
            const relatedProductsList = await getRelatedProducts({
                productId,
                categoryId: prodData?.category,
            });
            if (relatedProductsList?.status) setRelatedProducts(relatedProductsList?.responseBody?.products);
        } else router.push(`/${segment}`);
    };

    useEffect(() => {
        initialiser();
    }, [productId]);

    useEffect(() => {
        if (selectedVariant) {
            const found = cart?.products?.find(
                (prod: IProductData) => prod?.productId === productId && prod?.selectedVariant === selectedVariant
            );
            if (found?.quantity) setVariantCount(found?.quantity);
            else setVariantCount(0);
        }
    }, [selectedVariant, cart]);

    return (
        <Container>
            <SectionWrapper>
                <Row className="mt-5 position-relative">
                    <Col lg={7} md={6}>
                        <ProductGallery imageList={productData?.images} />
                    </Col>
                    <Col lg={5} md={6}>
                        <div className={style.detailsWrapper}>
                            <h2>{productData?.title}</h2>
                            {productData?.ratingsCount > 0 && (
                                <div className="mb-2">
                                    <ProductRatings ratings={productData?.ratings} className="d-inline-flex" />
                                    <span className={style.reviewsCount}>
                                        ({productData?.ratingsCount} {dictionary?.reviewsLabel})
                                    </span>
                                </div>
                            )}
                            <div className={style.price}>
                                {productData?.offerPrice > 0 && (
                                    <span className={style.discounted}>
                                        {formatPrice(productData?.offerPrice, false)}
                                    </span>
                                )}
                                <span className={cx(productData?.offerPrice && style.offerApplicable)}>
                                    {formatPrice(productData?.price, false)}
                                </span>
                                <p>{serverData?.mrpLabel}</p>
                                <FormControl.Feedback
                                    className={fewPiecesMsg ? 'd-block position-absolute' : ''}
                                    type="invalid"
                                >
                                    {fewPiecesMsg}
                                </FormControl.Feedback>
                            </div>
                            <div className={style.description}>
                                <p>{productData?.shortDescription}</p>
                                <p>{productData?.description}</p>
                            </div>
                            {productData?.variants?.length && selectedVariant !== VARIANT_ID.DEFAULT && (
                                <div className={style.variants}>
                                    <div className="d-flex align-items-center">
                                        <span className={style.title}>Size</span>
                                        <div className={style.variant}>
                                            {productData?.variants?.map((item: any) =>
                                                SIZE_LABELS[item.id] ? (
                                                    <span
                                                        key={`variant_${item}`}
                                                        onClick={() => setSelectedVariant(item.id)}
                                                        className={cx(
                                                            selectedVariant === item.id && style.selected,
                                                            item.units === 0 && style.disabled
                                                        )}
                                                    >
                                                        {SIZE_LABELS[item.id]}
                                                    </span>
                                                ) : (
                                                    <></>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <CustomButton
                                        variant="link"
                                        className={style.secondaryCta}
                                        onClick={() => setShowSizeGuide(true)}
                                    >
                                        {serverData?.buttons?.sizeGuide}
                                    </CustomButton>

                                    <div className={style.variantError}>
                                        <FormControl.Feedback className={variantError ? 'd-block' : ''} type="invalid">
                                            {variantError}
                                        </FormControl.Feedback>
                                    </div>
                                </div>
                            )}

                            {variantCount > 0 ? (
                                <CounterButton
                                    className={style.cartBtn}
                                    count={variantCount}
                                    loading={isLoading}
                                    handleIncrement={() => handleUpdateQuantity(CART_PRODUCT_OPERATION.INCREASE)}
                                    handleDecrement={() => handleUpdateQuantity(CART_PRODUCT_OPERATION.DECREASE)}
                                />
                            ) : (
                                <CustomButton
                                    className={cx(style.cartBtn, 'justify-content-center')}
                                    onClick={cartBtnClick}
                                    variant="secondary"
                                    disabled={isUnavailable}
                                    loading={isLoading}
                                >
                                    {serverData?.buttons?.addToCart}
                                </CustomButton>
                            )}
                            <Row className={style.usp}>
                                {serverData?.uspPoints?.map((item: any) => (
                                    <Col lg={4}>
                                        <i className={`font icon-${item.icon}`}></i>
                                        <span>{item.title}</span>
                                    </Col>
                                ))}
                            </Row>
                            {productData?.ratingsCount && (
                                <>
                                    <h4 className={style.reviewsHeading}>Reviews</h4>
                                    <div className={cx(productData?.ratingsCount > 3 && 'mb-3')}>
                                        <ReviewBlock
                                            customerName="Ryan Reynolds"
                                            ratings={4}
                                            reviewDate={new Date()}
                                            feedback="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est"
                                        />
                                        <ReviewBlock
                                            customerName="Ryan Reynolds"
                                            ratings={4}
                                            reviewDate={new Date()}
                                            feedback="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est"
                                        />
                                        <ReviewBlock
                                            customerName="Ryan Reynolds"
                                            ratings={4}
                                            reviewDate={new Date()}
                                            feedback="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est"
                                        />
                                    </div>
                                    {productData?.ratingsCount > 3 && (
                                        <CustomButton variant="link" className={cx(style.secondaryCta, 'mb-5')}>
                                            {serverData?.buttons?.seeReviews}
                                        </CustomButton>
                                    )}
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </SectionWrapper>
            <SectionWrapper>
                {relatedProducts?.length > 0 && (
                    <SectionWrapper>
                        <SectionHeader heading={serverData?.relatedProductsLabel} />
                        <ProductsCarousel productsList={relatedProducts} />
                    </SectionWrapper>
                )}
            </SectionWrapper>
            <SizeGuideModal
                show={showSizeGuide}
                setShow={setShowSizeGuide}
                title={serverData?.buttons?.sizeGuide}
                chartData={serverData?.sizeGuide}
            />
        </Container>
    );
};

export default ProductDetails;
