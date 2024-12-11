const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        VALIDATE_OTP: '/auth/validate-otp',
        FORGOT_PASSWORD: '/auth/forgot-password',
        UPDATE_PASSWORD: '/auth/update-password',
    },
    USER: {
        GET_PROFILE: '/user/get-profile',
        UPDATE_PROFILE: '/user/update-profile',
        ADD_ADDRESS: '/user/add-address',
        UPDATE_ADDRESS: '/user/update-address',
        DELETE_ADDRESS: '/user/delete-address',
    },
    PRODUCT: {
        GET_ALL_PRODUCTS: '/product/get-all-products',
        GET_PRODUCT_DETAILS: '/product/get-product-details',
        ADD_TO_CART: '/product/add-to-cart',
        REMOVE_FROM_CART: '/product/delete-from-cart',
        UPDATE_CART: '/product/update-product-quantity',
        ADD_TO_WISHLIST: '/product/add-to-wishlist',
        REMOVE_FROM_WISHLIST: '/product/delete-from-wishlist',
        GET_RELATED_PRODUCTS: '/product/get-related-products',
    },
    PAYMENT: {
        GET_PAYMENT_STATUS: '/payment/get-payment-status',
        CREATE_ORDER: '/payment/create-order',
        PLACE_ORDER: {
            CARD: '/payment/place-order/card',
        },
    },
};

export default API_ENDPOINTS;
