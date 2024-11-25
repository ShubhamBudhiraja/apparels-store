import { IToast } from '@interface/layout';
import React from 'react';
import { Toast } from 'react-bootstrap';

const CustomToast = (props: IToast) => {
    const { show = false, onClose, title, description, autohide, autohideDelay = 5000 } = props;

    return (
        <Toast onClose={onClose} show={show} autohide={autohide} delay={autohideDelay}>
            {title && (
                <Toast.Header closeButton={false} className={description ? 'mb-2' : ''}>
                    <h5>{title}</h5>
                </Toast.Header>
            )}
            {autohide ? <></> : <i className="font icon-cross close-icon" onClick={onClose}></i>}
            {description && (
                <Toast.Body>
                    <p>{description}</p>
                </Toast.Body>
            )}
        </Toast>
    );
};

export default CustomToast;
