'use client';
import React, { useContext, useState } from 'react';
import style from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@store';
import SavedAddresses from '@molecules/SavedAddresses';
import AddressForm from '@molecules/AddressForm';
import CustomButton from '@atoms/CustomButton';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import PersonalDetailsForm from '@molecules/PersonalDetailsForm';
import { LayoutContextData } from 'src/lib/context/layout';

const ShippingDetails = () => {
    const { addresses } = useAppSelector((state) => state.userProfile);
    const dispatch = useAppDispatch();
    const { dictionary } = useContext(LayoutContextData);

    const [addAddress, setAddAddress] = useState(false);
    const [step, setStep] = useState(1);

    const onAddressAddition = (addressId?: string) => {
        setAddAddress(false);
        if (addressId) dispatch(UserDataActions.updateCustomerDetails({ selectedAddress: addressId }));
    };

    return (
        <div className={style.addressWrapper}>
            {addresses?.length === 0 ? (
                <>
                    {step === 1 ? (
                        <>
                            <h3>{dictionary?.personalDetailsLabel}</h3>
                            <PersonalDetailsForm successCallback={() => setStep(2)} isCheckout />
                        </>
                    ) : (
                        <>
                            <h3>{dictionary?.shippingDetailsLabel}</h3>
                            <AddressForm successCallback={(addressId) => onAddressAddition(addressId)} />
                        </>
                    )}
                </>
            ) : (
                <>
                    <SavedAddresses addresses={addresses} />
                    {addAddress ? (
                        <>
                            <h3 className="mt-4">{dictionary?.addNewAddressLabel}</h3>
                            <AddressForm successCallback={(addressId) => onAddressAddition(addressId)} />
                        </>
                    ) : (
                        <CustomButton
                            className={style.addAddressBtn}
                            variant="link"
                            onClick={() => setAddAddress(true)}
                        >
                            + {dictionary?.addNewAddressLabel}
                        </CustomButton>
                    )}
                </>
            )}
        </div>
    );
};

export default ShippingDetails;
