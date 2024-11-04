import OverlayWrapper from '@molecules/OverlayWrapper';
import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'src/lib/store';
import { LoginModalActions } from 'src/lib/store/reducers/loginModalSlice';
import LoginForm from './loginForm';
import style from './index.module.scss';
import SignupForm from './signupForm';

interface ILoginModal {
    modalData?: any;
}

const LoginModal = (props: ILoginModal) => {
    const { modalData } = props;

    const { show } = useAppSelector((state) => state.loginModal);
    const dispatch = useAppDispatch();

    return (
        <OverlayWrapper show={show} onHide={() => dispatch(LoginModalActions.updateModalState({ show: false }))}>
            <>
                <img src={modalData?.siteLogo} className={style.logo} alt="" />
                <Tabs className={style.tabWrapper}>
                    <Tab title={modalData?.login?.heading} eventKey={modalData?.login?.heading}>
                        <LoginForm
                            formData={modalData?.login?.formData}
                            forgotPswdTxt={modalData?.login?.forgotPswdBtn}
                        />
                    </Tab>
                    <Tab title={modalData?.signup?.heading} eventKey={modalData?.signup?.heading}>
                        <SignupForm formData={modalData?.signup?.formData} />
                    </Tab>
                </Tabs>
            </>
        </OverlayWrapper>
    );
};

export default LoginModal;
