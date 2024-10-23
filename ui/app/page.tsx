import Home from 'src/components/pages/Home';
import data from '@staticData/home.json';

const Page = () => {
    return <Home serverData={data} />;
};

export default Page;
