import React from 'react';
import style from './index.module.scss';
import CustomButton from '@atoms/CustomButton';
import { useRouter } from 'next/navigation';

interface IEmptyWrapper {
    image?: string;
    title?: string;
    description?: string;
    btnText?: string;
    redirectUrl?: string;
}

const EmptyWrapper = (props: IEmptyWrapper) => {
    const { title, description, image, btnText = 'Go to home', redirectUrl = '/' } = props;

    const router = useRouter();

    return (
        <div className={style.wrapper}>
            <img src={image} alt="" />
            <h2>{title}</h2>
            <p>{description}</p>
            <CustomButton onClick={() => router.push(redirectUrl)} variant="secondary">
                {btnText}
            </CustomButton>
        </div>
    );
};

export default EmptyWrapper;
