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

const PlaceOrderLayout = (props: { pageData?: any; children: ReactNode }) => {
    const { pageData, children } = props;

    const [step, setStep] = useState(-1);

    const pathname = usePathname();
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.userProfile);

    useEffect(() => {
        if (pageData?.header) {
            const active = pageData?.header?.findIndex((item: any) => item?.link === pathname);
            setStep(active);
        }
    }, [pageData, pathname]);

    if (step !== -1)
        return (
            <Container>
                {cart?.products?.length > 0 ? (
                    <>
                        <div className={style.wrapper}>
                            <h1>{pageData?.header?.[step]?.title}</h1>
                            <ul className={cx(style[`step${step}`], style.stepper)}>
                                {pageData?.header?.map((item: any, index: number) => (
                                    <li
                                        key={`step_${index}`}
                                        className={cx(index <= step && style.active)}
                                        onClick={() => router.push(item?.link)}
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
                                    <CheckoutSummary activeStep={step} />
                                </Col>
                            </Row>
                        </SectionWrapper>
                    </>
                ) : (
                    <SectionWrapper className="mt-5">
                        <EmptyWrapper
                            title="Oops! Your cart is empty"
                            image="/images/empty-cart.png"
                            description="You haven't added anything to your cart yet. Please add some items and come back to checkout"
                        />
                    </SectionWrapper>
                )}
            </Container>
        );
};

export default PlaceOrderLayout;
