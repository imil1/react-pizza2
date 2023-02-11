import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 25px 25px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 13px;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    margin: 0 auto;
`;

const Loading = styled.div`
    max-width: 250px;
    height: 100px;
    text-align: center;
    margin: 60px auto;
    div {
        font-size: 32px;
        font-weight: 600;
    }
`;

const FullPizza: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pizza, setPizza] = React.useState<{
        imageUrl:string,
        title:string,
        price:number,
    }>();

    React.useEffect(() => {
        const fetchPizza = async () => {
            try {
                const { data } = await axios.get(
                    `https://63c3de2cf0028bf85f9ec115.mockapi.io/items/${id}`
                );
                setPizza(data);
            } catch (err) {
                alert('Ошибка сервера!');
                console.warn(err);
                navigate('/');
            }
        };
        fetchPizza();
        //eslint-disable-next-line
    }, []);


    const clickBack = () => {
        navigate('/')
    }

    if (!pizza) {
        return (
            <Loading>
                <div className='container'>Загрузка...</div>
            </Loading>
        );
    }

 

    return (
        <div className='container'>
            <Wrapper>
                <img
                    width={250}
                    height={250}
                    alt='fullPizza'
                    src={pizza.imageUrl}
                />
                <h2>{pizza.title}</h2>
                <h4>{pizza.price} ₽</h4>
                <button onClick={clickBack}>Назад</button>
            </Wrapper>
        </div>
    );
};

export default FullPizza;
