import ProductList from '../page/ListPages/ProductList';
import UserList from '../page/ListPages/UserList';
import { ROUTES } from 'configs/routes';

interface Props {
    location?: any
}

const Content = (props: Props) => {
    const { location } = props;

    console.log(location);

    switch (location.pathname) {
        case ROUTES.userList:
            return (
                <UserList/>
            );
    
        default:
            break;
    }
    

    return (
        <ProductList/>
    );
}

export default Content;