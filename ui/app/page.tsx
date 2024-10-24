import Home from 'src/components/pages/Home';
import data from '@staticData/home.json';
import products from '@staticData/products.json';

const Page = () => {
    return <Home serverData={{ ...data, ...products }} />;
};

export default Page;
