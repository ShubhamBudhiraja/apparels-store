const useProduct = () => {
    const handleAddToCart = ({ userId, productId }: { userId?: string; productId?: string }) => {
        if (userId && productId) console.info('email=>', userId, ' productId=>', productId);
    };

    const handleAddToWishlist = ({ userId, productId }: { userId?: string; productId?: string }) => {
        if (userId && productId) console.info('email=>', userId, ' productId=>', productId);
    };

    return { handleAddToCart, handleAddToWishlist };
};

export default useProduct;
