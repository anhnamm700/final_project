import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingShield, faUserGroup, faAngleDown, faAngleLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import { ROUTES } from "configs/routes";
import './style.css';

interface Props {
    isHidden: boolean,
    onOpenSideBar: () => void
}

const Sidebar = (props: Props) => {
    const { isHidden, onOpenSideBar } = props;


    const [isProductExpand, setIsProductExpand] = useState<boolean>(false);
    const [isUserExpand, setIsUserExpand] = useState<boolean>(false);

    return (
        <div>
            <ul className="list">
                <li className='align-items-center flex-column'>
                    <div className='list-item d-flex align-items-center' onClick={() => {
                        setIsProductExpand(!isProductExpand);
                        onOpenSideBar();
                    }}>
                        <span className='d-flex align-items-center'>
                            <FontAwesomeIcon icon={faBuildingShield}/>
                            { isHidden ? '' : <p>Sản phẩm</p> }
                        </span>

                        <FontAwesomeIcon icon={isProductExpand ? faAngleDown : faAngleLeft}/>
                    </div>

                    {
                        isProductExpand && (
                            <ul className={`hidden-list ${ isProductExpand ? 'show' : '' }`}>
                                <li className='list-item list-item-small'><Link to={ROUTES.productList}>Danh sách sản phẩm</Link></li>
                                <li className='list-item list-item-small'>Khác</li>
                            </ul>
                        )
                    }
                </li>

                <li className='align-items-center flex-column'>
                    <div className='list-item d-flex align-items-center' onClick={() => {
                        setIsUserExpand(!isUserExpand);
                        onOpenSideBar();
                    }}>
                        <span className='d-flex align-items-center'>
                            <FontAwesomeIcon icon={faUser}/>
                            { isHidden ? '' : <p>Tài khoản</p> }
                        </span>

                        <FontAwesomeIcon icon={isUserExpand ? faAngleDown : faAngleLeft}/>
                    </div>

                    {
                        isUserExpand && (
                            <ul className={`hidden-list ${ isUserExpand ? 'show' : '' }`}>
                                <li className='list-item list-item-small'><Link to={ROUTES.userList}>Danh sách tài khoản</Link></li>
                                <li className='list-item list-item-small'>Khác</li>
                            </ul>
                        )
                    }
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;