import React from 'react';
import { Modal } from 'react-bootstrap';
import { IOverlay } from 'src/lib/interface/common';

const Popup = (props: IOverlay) => {
    const { show, onHide, heading, headerProps, children, bodyClassName, wrapperClassName = '', modalProps } = props;

    return (
        <Modal show={show} onHide={onHide} centered className={wrapperClassName} {...modalProps}>
            {heading && (
                <Modal.Header {...headerProps}>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
            )}
            {children && <Modal.Body className={bodyClassName}>{children}</Modal.Body>}
        </Modal>
    );
};

export default Popup;
