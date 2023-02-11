import React from 'react';
import qs from 'qs';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchPizzas, FetchPizzasArgs, selectPizza } from '../redux/slices/pizzaSlice';
import {
    selectFilter,
    setCategoryId,
    setCurrentPage,
    setFilters,
} from '../redux/slices/filterSlice';
import { Categories } from '../Components/Categories';
import { sortList, SortPopup } from '../Components/Sort';
import { Skeleton } from '../Components/PizzaBlock/Skeleton';
import { PizzaBlock } from '../Components/PizzaBlock';
import { Pagination } from '../Components/Pagination';

import { Search } from '../Components/Search';
import { useAppDispatch } from '../redux/store';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);

    const { items, status } = useSelector(selectPizza);
    const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

    const onChangePage = (number: number) => {
        dispatch(setCurrentPage(number));
    };

    const onChangeCategory = React.useCallback((id: number) => {
        dispatch(setCategoryId(id));
        // eslint-disable-next-line
    }, []);

    const getPizzas = async () => {
        const sortBy = sort.sortProperty.replace('-', '');
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';
        dispatch(
            fetchPizzas({
                sortBy,
                order,
                category,
                search,
                currentPage: String(currentPage),
            })
        );
    };

    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            });
            navigate(`?${queryString}`);
        }
        isMounted.current = true;
        // eslint-disable-next-line
    }, [categoryId, sort.sortProperty, currentPage]);

    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(
                window.location.search.substring(1)
            ) as unknown as FetchPizzasArgs;

            const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);

            dispatch(
                setFilters({
                    searchValue: params.search,
                    categoryId: Number(params.category),
                    currentPage: Number(params.currentPage),
                    sort: sort || sortList[0],
                })
            );
            isSearch.current = true;
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        window.scrollTo(0, 0);
        if (!isSearch.current) {
            getPizzas();
        }
        isSearch.current = false;
        // eslint-disable-next-line
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);

    const pizzas = items.map((obj: any) => <PizzaBlock {...obj} />);
    const skeletons = [...new Array(8)].map((_, index) => <Skeleton key={index} />);

    return (
        <>
            <div className='container'>
                <div className='content__top'>
                    <Categories
                        value={categoryId}
                        onChangeCategory={onChangeCategory}
                    />
                    <SortPopup />
                </div>
                <h2 className='content__title'>
                    <strong>Все пиццы</strong>
                    <Search />
                </h2>
                {status === 'error' ? (
                    <div className='content__error-info'>
                        <h2>Произошла ошибка сервера 😕 </h2>
                        <p>К сожалению не удалось получить пиццы ,пожалуйста попробуйте позже</p>
                    </div>
                ) : (
                    <div className='content__items'>
                        {status === 'loading' ? skeletons : pizzas}
                    </div>
                )}
                {status === 'error' ? (
                    ''
                ) : (
                    <Pagination
                        value={currentPage}
                        onChangePage={onChangePage}
                    />
                )}
            </div>
        </>
    );
};
