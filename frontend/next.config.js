/* eslint-disable @typescript-eslint/no-var-requires */
const LOADENV = process.env.NODE_ENV;
const dotEnv = require('dotenv');
dotEnv.config({ path: `./.env.${LOADENV}` });

const nextConfig = {
    sassOptions: {
        includePaths: ['ui/src/styles/'],
    },
};

module.exports = nextConfig;
