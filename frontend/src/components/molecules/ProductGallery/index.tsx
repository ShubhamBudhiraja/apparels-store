import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import cx from 'classnames';

interface IProductGallery {
    imageList?: string[];
}

const ProductGallery = (props: IProductGallery) => {
    const { imageList } = props;

    const [primaryImg, setPrimaryImg] = useState('');

    useEffect(() => {
        if (imageList?.length) setPrimaryImg(imageList[0]);
    }, [imageList]);

    return (
        <div className={style.wrapper}>
            <div className={style.thumbnails}>
                {imageList?.map((image: string, index: number) => (
                    <figure className={cx(image === primaryImg && style.active)} onClick={() => setPrimaryImg(image)}>
                        <img src={image} alt={`productImage_${index}`} />
                    </figure>
                ))}
            </div>
            <div className={style.primaryImage}>
                <img src={primaryImg} alt="" />
            </div>
        </div>
    );
};

export default ProductGallery;
