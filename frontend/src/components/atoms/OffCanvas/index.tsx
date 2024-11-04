import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { IOverlay } from 'src/lib/interface/common';

interface IOffCanvas extends IOverlay {
    height?: number;
}

const OffCanvas = (props: IOffCanvas) => {
    const { show, onHide, children, height, bodyClassName = '' } = props;

    return (
        <Offcanvas show={show} onHide={onHide} placement="bottom" style={{ height: height ? `${height}%` : 'auto' }}>
            <Offcanvas.Body className={bodyClassName}>{children}</Offcanvas.Body>
        </Offcanvas>
    );
};

export default OffCanvas;
