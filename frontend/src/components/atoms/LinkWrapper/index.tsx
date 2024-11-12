import Link from 'next/link';
import React from 'react';
import { AnchorProps } from 'react-bootstrap';

const LinkWrapper = (props: AnchorProps) => {
    const { href = 'javascript:void(0)', children, ...restProps } = props;
    return (
        <Link href={href} {...restProps}>
            {children}
        </Link>
    );
};

export default LinkWrapper;
