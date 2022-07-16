import axios from "axios";
import { API_PATHS } from "configs/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from "configs/routes";
import LoginComponent from "../components/LoginComponent";
import LoadingComponent from "modules/components/LoadingComponent/LoadingComponent";
import { setToken, setUser } from '../redux/authSlice';
import { ACCESS_TOKEN_KEY } from "utils/constant";

import './style.css';

const LoginPage = () => {
    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const selector = useSelector(state => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate(ROUTES.productList);
        }
    }, [navigate]);

    const handleLogin = async(values: any) => {
        const data = {
            email: values.email,
            password: values.password
        }

        setLoading(true);

        try {
            const dataResponse = await axios({
                method: 'post',
                url: API_PATHS.signIn,
                data: data,
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })

            if (dataResponse?.data?.user) {
                dispatch(setUser(dataResponse.data));
                localStorage.setItem('user', JSON.stringify({ ACCESS_TOKEN_KEY, ...values }));
                Cookies.set(ACCESS_TOKEN_KEY, dataResponse.data.user_cookie, { expires: values.rememberMe ? 7 : undefined });
                navigate(ROUTES.productList);
                return;
            } else {
                alert(dataResponse?.data?.errors?.email);
            }

            setLoading(false);
            
        } catch (error: any) {
            throw new Error(error);
        }
          
    }

    return (
        <div>
            { loading && <LoadingComponent/> }
            <Container className="wrapper col-3">
                <Row className="col-12">
                    <Col className="login-form">
                        <h1 className="d-flex justify-content-center">Đăng Nhập</h1>
                        <LoginComponent onLogin={handleLogin} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;