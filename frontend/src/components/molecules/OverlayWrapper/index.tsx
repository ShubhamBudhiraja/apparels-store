import OffCanvas from '@atoms/OffCanvas';
import Popup from '@atoms/Popup';
import { DEVICE_TYPES } from '@enums/layout';
import React from 'react';
import { useDeviceType } from 'src/lib/customHooks/useDevicetype';
import { IOverlay } from 'src/lib/interface/common';

interface IOverlayWrapper extends IOverlay {
    isOffCanvas?: boolean;
    offCanvasHeight?: number;
}

const OverlayWrapper = (props: IOverlayWrapper) => {
    const {
        show,
        onHide,
        heading,
        headerProps,
        children,
        isOffCanvas = true,
        offCanvasHeight,
        bodyClassName = '',
    } = props;

    const { deviceType } = useDeviceType();

    return isOffCanvas && deviceType === DEVICE_TYPES.MOBILE ? (
        <OffCanvas
            show={show}
            onHide={onHide}
            heading={heading}
            headerProps={headerProps}
            bodyClassName={bodyClassName}
            height={offCanvasHeight}
        >
            {children}
        </OffCanvas>
    ) : (
        <Popup show={show} onHide={onHide} heading={heading} headerProps={headerProps} bodyClassName={bodyClassName}>
            {children}
        </Popup>
    );
};

export default OverlayWrapper;
