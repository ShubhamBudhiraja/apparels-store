'use client';

import React, { useContext, useEffect, useState } from 'react';
import style from './index.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import SectionHeader from '@atoms/SectionHeader';
import Loader from '@atoms/Loader';
import ProductCard from '@molecules/ProductCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import useProductsAPI from 'api-managers/services/products';
import useCategoriesAPI, { ICategoryNode } from 'api-managers/services/categories';
import { IProductData } from '@interface/products';
import { useAppSelector } from '@store';
import { LayoutContextData } from 'src/lib/context/layout';
import layoutData from '@staticData/layout.json';

interface IShopMain {
    segment?: string;
}

const formatLabel = (value?: string | null) => {
    if (!value) return '';
    return value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-');
};

const buildShopHref = (segment?: string, subCategory?: string) => {
    if (!segment) return '/shop';
    const params = new URLSearchParams({ category: segment });
    if (subCategory) params.set('subCategory', subCategory);
    return `/shop?${params.toString()}`;
};

const mapStaticMenusToCategories = (): ICategoryNode[] => {
    const menus = layoutData?.headerData?.hamburgerData?.menuItems || [];
    return menus.map((menu, index) => ({
        id: menu.title,
        name: menu.title,
        slug: menu.title.toLowerCase(),
        parentId: null,
        sortOrder: index + 1,
        isActive: true,
        children: (menu.subMenu || []).map((item, childIndex) => ({
            id: `${menu.title}_${item.title}`,
            name: item.title,
            slug:
                item.link?.split('subCategory=')[1]?.split('&')[0] ||
                item.title.toLowerCase(),
            parentId: menu.title,
            sortOrder: childIndex + 1,
            isActive: true,
        })),
    }));
};

const ShopMain = (props: IShopMain) => {
    const { segment: segmentFromRoute } = props;
    const searchParams = useSearchParams();
    const { dictionary } = useContext(LayoutContextData);
    const { getProducts } = useProductsAPI();
    const { getCategoryTree } = useCategoriesAPI();
    const { wishlist } = useAppSelector((state) => state.userProfile);

    const selectedSegment = segmentFromRoute || searchParams.get('category') || undefined;
    const selectedCategory = searchParams.get('subCategory') || undefined;

    const [products, setProducts] = useState<IProductData[]>([]);
    const [categories, setCategories] = useState<ICategoryNode[]>(mapStaticMenusToCategories());
    const [loading, setLoading] = useState(true);

    const pageHeading = selectedCategory
        ? formatLabel(selectedCategory)
        : selectedSegment
          ? formatLabel(selectedSegment)
          : dictionary?.shopLabel || 'Shop';

    const fetchCategories = async () => {
        const res = await getCategoryTree();
        if (res?.status && res?.responseBody?.categories?.length) {
            setCategories(res.responseBody.categories);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        const params: { segment?: string; category?: string } = {};
        if (selectedSegment) params.segment = selectedSegment;
        if (selectedCategory) params.category = selectedCategory;

        const res = await getProducts(Object.keys(params).length ? params : undefined);
        setProducts(res?.responseBody?.products || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedSegment, selectedCategory]);

    return (
        <>
            <div className={style.strip}>
                <Container>
                    <p>Get 15% off on your first order</p>
                </Container>
            </div>

            <Container className={style.shopPage}>
                <div className={style.pageHeader}>
                    <SectionHeader heading={pageHeading} className={style.pageHeading} isH1 />
                    {!loading && (
                        <p className={style.count}>
                            {(dictionary?.productsCountLabel || '$ products').replace('$', String(products.length))}
                        </p>
                    )}
                </div>

                <Row className="g-4">
                    <Col lg={3} md={4}>
                        <aside className={style.filters}>
                            <h2 className={style.filtersTitle}>{dictionary?.filtersLabel || 'Filters'}</h2>

                            <div className={style.filterGroup}>
                                <h3>{dictionary?.categoriesLabel || 'Categories'}</h3>
                                <ul>
                                    <li>
                                        <Link
                                            href="/shop"
                                            className={!selectedSegment ? style.active : undefined}
                                        >
                                            {dictionary?.shopAllLabel || 'All Products'}
                                        </Link>
                                    </li>
                                    {categories.map((menu) => {
                                        const isActive = selectedSegment?.toLowerCase() === menu.slug;

                                        return (
                                            <li key={menu.id}>
                                                <Link
                                                    href={buildShopHref(menu.slug)}
                                                    className={isActive && !selectedCategory ? style.active : undefined}
                                                >
                                                    {menu.name}
                                                </Link>
                                                {isActive && menu.children?.length > 0 && (
                                                    <ul className={style.subCategories}>
                                                        {menu.children.map((item) => {
                                                            const isSubActive = selectedCategory === item.slug;

                                                            return (
                                                                <li key={item.id}>
                                                                    <Link
                                                                        href={buildShopHref(menu.slug, item.slug)}
                                                                        className={isSubActive ? style.active : undefined}
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {(selectedSegment || selectedCategory) && (
                                <Link href="/shop" className={style.clearFilters}>
                                    {dictionary?.clearFiltersLabel || 'Clear filters'}
                                </Link>
                            )}
                        </aside>
                    </Col>

                    <Col lg={9} md={8}>
                        {loading ? (
                            <div className={style.loadingState}>
                                <Loader />
                            </div>
                        ) : products.length > 0 ? (
                            <div className={style.productsGrid}>
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={`${product.productId}_${index}`}
                                        {...product}
                                        inWishlist={
                                            !!wishlist?.find(
                                                (item: IProductData) => item?.productId === product?.productId
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={style.emptyState}>
                                <p>{dictionary?.noProductsLabel || 'No products found for this selection.'}</p>
                                {(selectedSegment || selectedCategory) && (
                                    <Link href="/shop">{dictionary?.clearFiltersLabel || 'Clear filters'}</Link>
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ShopMain;
