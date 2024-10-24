import style from './index.module.scss';
import React from 'react';

interface ISectionHeader {
    isH1?: boolean;
    className?: string;
    heading?: string;
}

const SectionHeader = (props: ISectionHeader) => {
    const { heading, isH1 = false, className = '' } = props;
    return (
        <>
            {isH1 ? (
                <h1 className={`${style.heading} ${className}`}> {heading}</h1>
            ) : (
                <h2 className={`${style.heading} ${className}`}>{heading}</h2>
            )}
        </>
    );
};

export default SectionHeader;
