import { useCallback } from 'react';
import { useAppSelector } from '../store';

const useProduct = () => {
    const profileData = useAppSelector((state) => state.userProfile);

    const handleAddToCart = useCallback(
        (productId: string) => {
            console.log('email=>', profileData.email, ' productId=>', productId);
        },
        [profileData]
    );

    const handleAddToWishlist = useCallback(
        (productId: string) => {
            console.log('email=>', profileData.email, ' productId=>', productId);
        },
        [profileData]
    );

    return { handleAddToCart, handleAddToWishlist };
};

export default useProduct;
