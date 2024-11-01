import style from './index.module.scss';
import React from 'react';

interface ISectionWrapper {
    className?: string;
    children: React.ReactNode;
}

const SectionWrapper = (props: ISectionWrapper) => {
    const { children, className = '' } = props;

    return <div className={`${style.section} ${className}`}>{children}</div>;
};

export default SectionWrapper;
