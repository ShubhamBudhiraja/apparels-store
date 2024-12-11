'use client';
import { usePathname, useRouter } from 'next/navigation';
import style from './index.module.scss';
import React, { ReactNode, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SectionWrapper from '@atoms/SectionWrapper';
import cx from 'classnames';
import CheckoutSummary from './checkoutSummary';
import { useAppSelector } from '@store';
import EmptyWrapper from '@molecules/EmptyWrapper';
import { ROUTES } from 'src/lib/constants/routes';

const PlaceOrderLayout = (props: { pageData?: any; children: ReactNode }) => {
    const { pageData, children } = props;

    const pathname = usePathname();
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.userProfile);

    const [step, setStep] = useState(-1);
    const [ctaText, setCtaText] = useState('');

    useEffect(() => {
        if (pageData?.header) {
            const active = pageData?.header?.findIndex((item: any) => item?.link === pathname);
            setStep(active);
        }
    }, [pageData, pathname]);

    useEffect(() => {
        if (step > 0 && cart?.products?.length === 0) router.push(ROUTES.CART);
        if (step === 1) setCtaText(pageData?.buttons?.payment);
        else setCtaText(pageData?.buttons?.continue);
    }, [step]);

    if (step !== -1)
        return (
            <Container>
                {cart?.products && cart?.products?.length > 0 ? (
                    <>
                        <div className={style.stepperWrapper}>
                            <h1>{pageData?.header?.[step]?.title}</h1>
                            <ul className={cx(style[`step${step}`], style.stepper)}>
                                {pageData?.header?.map((item: any, index: number) => (
                                    <li
                                        key={`step_${index}`}
                                        className={cx(index > step && 'pe-none')}
                                        onClick={() => index < step && router.push(item?.link)}
                                    >
                                        <span>0{index + 1}</span>
                                        <div>
                                            <h3>{item?.subtitle}</h3>
                                            <p>{item?.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <SectionWrapper>
                            <Row className="justify-content-between">
                                <Col lg={7}>{children}</Col>
                                <Col lg={4}>
                                    <CheckoutSummary
                                        activeStep={step}
                                        ctaText={ctaText}
                                        billingData={pageData?.billingDetails}
                                        shippingData={pageData?.shippingData}
                                    />
                                </Col>
                            </Row>
                        </SectionWrapper>
                    </>
                ) : (
                    <SectionWrapper className="mt-5">
                        <EmptyWrapper
                            title={pageData?.emptyCart?.title}
                            image={pageData?.emptyCart?.image}
                            description={pageData?.emptyCart?.description}
                        />
                    </SectionWrapper>
                )}
            </Container>
        );
};

export default PlaceOrderLayout;
