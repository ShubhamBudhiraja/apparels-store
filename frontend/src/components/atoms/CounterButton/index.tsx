import React from 'react';
import style from './index.module.scss';
import cx from 'classnames';
import Loader from '@atoms/Loader';

interface ICounterButton {
    count?: number;
    handleIncrement: any;
    handleDecrement: any;
    className?: string;
    loading?: boolean;
}

const CounterButton = (props: ICounterButton) => {
    const { count, handleIncrement, handleDecrement, className, loading = false } = props;

    return (
        <div className={cx(style.updateBtn, loading && 'justify-content-center', className)}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <span className={style.counter} onClick={handleDecrement}>
                        -
                    </span>
                    <span>{count}</span>
                    <span className={style.counter} onClick={handleIncrement}>
                        +
                    </span>
                </>
            )}
        </div>
    );
};

export default CounterButton;
