import React from 'react';
import debounce from 'lodash.debounce';

import styles from './Search.module.scss';
import searchSvg from '../../assets/img/search.svg';
import closeSvg from '../../assets/img/close.svg';
import { useDispatch } from 'react-redux';
import { setSearchValue } from '../../redux/slices/filterSlice';

export const Search: React.FC = () => {
    const dispatch = useDispatch();
    const [value, setValue] = React.useState('');

    const inputRef = React.useRef<HTMLInputElement>(null);

    // eslint-disable-next-line
    const updateSearchValue = React.useCallback(
        debounce((str: string) => {
            dispatch(setSearchValue(str));
        }, 500),
        []
    );
    const clearInput = () => {
        dispatch(setSearchValue(''));
        setValue('');
        inputRef.current?.focus();
    };

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        /* changeevent для реакта */
        setValue(event.target.value);
        updateSearchValue(event.target.value);
    };

    return (
        <div className={styles.root}>
            <input
                ref={inputRef}
                value={value}
                onChange={onChangeInput}
                className={styles.input}
                placeholder='Поиск пиццы ...'
            />
            <img
                className={styles.icon}
                src={searchSvg}
                alt='search'
            />
            {value && (
                <img
                    onClick={clearInput}
                    className={styles.close}
                    src={closeSvg}
                    alt='search'
                />
            )}
        </div>
    );
};
