import { IUserAddress } from '@interface/user';
import React from 'react';
import style from './index.module.scss';
import SingleAddress from './singleAddress';

interface ISavedAddresses {
    addresses?: IUserAddress[];
}

const SavedAddresses = (props: ISavedAddresses) => {
    const { addresses } = props;

    return (
        <ul className={style.listWrapper}>
            {addresses?.map((address: IUserAddress) => (
                <SingleAddress key={`savedAddress_${address._id}`} address={address} />
            ))}
        </ul>
    );
};

export default SavedAddresses;
