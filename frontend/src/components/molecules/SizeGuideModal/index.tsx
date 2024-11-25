import OverlayWrapper from '@molecules/OverlayWrapper';
import style from './index.module.scss';
import React from 'react';
import { Table } from 'react-bootstrap';

interface ISizeGuideModal {
    show?: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    chartData?: any;
    title?: string;
}

const SizeGuideModal = (props: ISizeGuideModal) => {
    const { show, setShow, chartData, title } = props;

    return (
        <OverlayWrapper
            show={show}
            onHide={() => setShow(false)}
            heading={title}
            bodyClassName={style.modalBody}
            wrapperClassName={style.customWrapper}
        >
            <img src="/images/size-guide.jpg" />
            <div className={style.content}>
                {chartData?.map((item: any, index: number) => (
                    <div className={style.tableWrap} key={`guideTable_${index}`}>
                        <Table borderless>
                            <thead>
                                <tr>
                                    {item?.tableHeading?.map((heading: string, headingIndex: number) => (
                                        <th key={`tableHeading_${item?.heading}_${headingIndex}`}>{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(item?.tableData)?.map(([key, values]: any) => (
                                    <tr>
                                        <td>{key}</td>
                                        {values?.map((value: any) => (
                                            <td>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}
            </div>
        </OverlayWrapper>
    );
};

export default SizeGuideModal;
