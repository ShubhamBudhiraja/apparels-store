import AddressForm from '@molecules/AddressForm';
import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import style from './index.module.scss';
import CustomButton from '@atoms/CustomButton';
import { IUserAddress } from '@interface/user';
import { useAppDispatch, useAppSelector } from '@store';
import { UserDataActions } from '@store/reducers/userProfileSlice';
import { LayoutContextData } from 'src/lib/context/layout';

interface ISingleAddress {
    address: IUserAddress;
}

const SingleAddress = (props: ISingleAddress) => {
    const { address } = props;

    const [isEdit, setIsEdit] = useState(false);

    const dispatch = useAppDispatch();
    const { dictionary } = useContext(LayoutContextData);

    const { selectedAddress } = useAppSelector((state) => state.userProfile);

    const handleRadioClick = () => {
        if (address?._id) dispatch(UserDataActions.updateCustomerDetails({ selectedAddress: address?._id }));
    };

    return (
        <li>
            <Form.Check
                type="radio"
                checked={selectedAddress === address?._id}
                className={style.customRadio}
                onClick={handleRadioClick}
            />
            {isEdit ? (
                <div className={style.details}>
                    <h5 className="mb-3">{dictionary?.editDetailsLabel}</h5>
                    <AddressForm addressDetails={address} successCallback={() => setIsEdit(false)} isEditMode />
                </div>
            ) : (
                <div className={style.details}>
                    <div className="flex-between">
                        <h5>
                            {address?.firstName} {address?.lastName}
                        </h5>
                        <CustomButton variant="link" onClick={() => setIsEdit(true)}>
                            {dictionary?.editLabel}
                        </CustomButton>
                    </div>
                    <span>{address?.mobileNo}</span>
                    <p>
                        {address?.houseNo}, {address?.streetAddress}, {address?.city}, {address?.state} -{' '}
                        {address?.pincode}
                    </p>
                </div>
            )}
        </li>
    );
};

export default SingleAddress;
