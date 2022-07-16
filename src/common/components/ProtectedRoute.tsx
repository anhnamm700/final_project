import { Navigate, Route, RouteProps, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY } from 'utils/constant';
import { ROUTES } from 'configs/routes';

interface Props extends RouteProps {};

const ProtectedRoute = (props: Props) => {
    const { ...rest } = props;
    const auth = Cookies.get(ACCESS_TOKEN_KEY);

    return (
        auth ? <Outlet/> : <Navigate to={ROUTES.login} replace/>
    );
}

export default ProtectedRoute;


