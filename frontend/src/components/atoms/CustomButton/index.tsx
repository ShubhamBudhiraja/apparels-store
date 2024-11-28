import Loader from '@atoms/Loader';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface ICustomButton extends ButtonProps {
    loading?: boolean;
}

const CustomButton = (props: ICustomButton) => {
    const { loading, children, ...rest } = props;

    const buttonRef = useRef<any>();

    const [minWidth, setMinWidth] = useState();

    useEffect(() => {
        if (children) {
            const width = buttonRef?.current?.clientWidth;
            setMinWidth(width);
        }
    }, [children]);

    return (
        <Button style={{ minWidth }} ref={buttonRef} {...rest}>
            {loading ? <Loader /> : children}
        </Button>
    );
};

export default CustomButton;
