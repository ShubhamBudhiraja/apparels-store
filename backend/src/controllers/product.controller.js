const productControllers = () => {
    const addToCart = async (req, res) => {
        console.log(req); // do some research about db schema - whether to create diff collection for wishlist and cart or add the entire product in profile api
    };

    return { addToCart };
};

module.exports = productControllers;
