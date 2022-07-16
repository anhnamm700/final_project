import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation, Router } from 'react-router-dom';


import { ROUTES } from 'configs/routes';
import ProtectedRoute from 'common/components/ProtectedRoute';
import LoadingComponent from 'modules/components/LoadingComponent/LoadingComponent';


const HomePage = lazy(() => import('./modules/admin/page/home'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const UserList = lazy(() => import('./modules/admin/page/ListPages/UserList'));
const ProductList = lazy(() => import('./modules/admin/page/ListPages/ProductList'));
const ProductDetail = lazy(() => import('modules/admin/page/DetailPages/ProductDetail/ProductDetail'));
const ProductAdd = lazy(() => import('modules/admin/page/DetailPages/ProductDetail/ProductAdd'));
const UserDetail = lazy(() => import('modules/admin/page/DetailPages/UserDetail/UserDetail'));
const UserAdd = lazy(() => import('modules/admin/page/DetailPages/UserDetail/UserAdd'));

export const Navigate = () => {
    const location = useLocation();

    const privateRoute: any[] = [
        { route: ROUTES.productList, component: ProductList },
        { route: ROUTES.userList, component: UserList },
        { route: ROUTES.productDetail, component: ProductDetail },
        { route: ROUTES.addProduct, component: ProductAdd },
        { route: ROUTES.userDetail, component: UserDetail },
        { route: ROUTES.addUser, component: UserAdd },
    ];

    return (
        <Suspense fallback={<LoadingComponent/>}>
            <Routes location={location}>
                <Route element={<ProtectedRoute/>}>
                    {/* <Route path={ROUTES.home} element={<HomePage childrens={{UserList, ProductList}}/>} />
                    {/* <Route path={ROUTES.users} element={<UserList/>} />*/}
                    {/* <Route path={ROUTES.productList} element={<HomePage childrens={<ProductList/>}/>} />  */} 

                    {
                        privateRoute.map((route: any, index: number) => {
                            const Page = route.component;

                            return <Route key={index} path={route.route} element={<HomePage children={<Page/>}/>} />
                        })
                    }

                </Route>
                
                <Route path={ROUTES.login} element={<LoginPage/>}/>

                <Route path='/' element={<LoginPage/>}/>
            </Routes>
        </Suspense>
    );
}