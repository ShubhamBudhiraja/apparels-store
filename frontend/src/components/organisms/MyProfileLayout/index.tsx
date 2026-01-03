'use client';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import style from './index.module.scss';
import { useAppSelector } from '@store';
import dummy from '@staticData/myProfile.json';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MyProfileLayout = (props: { children: React.ReactNode }) => {
    const { children } = props;

    const { firstName } = useAppSelector((state) => state.userProfile);
    const pathName = usePathname();

    return (
        <Container>
            <section className={style.profileHeader}>
                <h1>Hi {firstName || 'there'}!</h1>
            </section>
            <Row>
                <Col lg={3} as={'ul'} className={style.sidebar}>
                    {dummy?.sidebar?.map((item: { title: string; link: string }, index: number) => (
                        <li className={pathName.includes(item.link) ? style.active : undefined}>
                            <Link href={item.link}>{item.title}</Link>
                        </li>
                    ))}
                </Col>
                <Col lg={9} className="px-4 mb-5">
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default MyProfileLayout;
