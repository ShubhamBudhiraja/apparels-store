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
        GET_SAVED_CARDS_LIST: '/payment/get-saved-cards-list',
        GET_CARD_DETAILS: '/payment/get-card-info',
    },
    ORDERS: {
        GET_ORDERS: '/orders/get-orders-list',
        GET_ORDER_DETAILS: '/orders/get-order-details',
        SUBMIT_ORDER_FEEDBACK: '/orders/submit-feedback',
    },
};

export default API_ENDPOINTS;
