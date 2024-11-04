import Loader from '@atoms/Loader';
import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

interface ICustomButton extends ButtonProps {
    loading?: boolean;
}

const CustomButton = (props: ICustomButton) => {
    const { loading, children, ...rest } = props;

    return <Button {...rest}> {loading ? <Loader /> : children}</Button>;
};

export default CustomButton;
