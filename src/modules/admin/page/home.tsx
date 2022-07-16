import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

import { ROUTES } from 'configs/routes';
import { ACCESS_TOKEN_KEY } from 'utils/constant';
import { Content, Sidebar, Header } from '../components';

import './style.css';

interface Props {
    children: any
}

const Home = (props: Props) => {
    const { children } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const [isHidden, setIsHidden] = useState<boolean>(false);

    const handleCloseSildeBar = () => {
        setIsHidden(!isHidden);
    }
    
    return (
        <Container fluid>
            <Row>
                <Header
                    className=''
                    onClose={handleCloseSildeBar}
                />
            </Row>
            <Row className='d-flex containerHome'>
                <Col className={ isHidden ? 'col-1 sidebar' : 'col-2 sidebar'}>
                    <Sidebar 
                        isHidden={isHidden} 
                        onOpenSideBar={() => setIsHidden(false)}
                    />
                </Col>

                <Col className={ isHidden ? 'col-11 content' : 'col-10 content'}>
                    { children }
                </Col>
            </Row>
        </Container>
    );
}

export default Home;