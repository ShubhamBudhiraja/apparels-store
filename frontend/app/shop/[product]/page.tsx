const Page = (props: any) => {
    const { params } = props;

    return <div>{params?.product}</div>;
};

export default Page;
