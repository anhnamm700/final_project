import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './style.css';
import { useState } from 'react';
import { ROUTES } from 'configs/routes';

interface Props {
    className: string,
    onClose: () => void,
    onLogout: () => void
}

const Header = (props: Props) => {
    const { className, onClose, onLogout } = props;
    const navigate = useNavigate();
    const userInfo = useSelector((state: any) => state?.auth?.user?.user);

    const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);


    return (
        <div className={`${className} header fixed-top`}>
            <div className='title-box'>
                <span>
                    <FontAwesomeIcon 
                        icon={faBars} 
                        className='icon'
                        onClick={onClose}
                    />
                </span>

                <h6 className='title-home' onClick={() => navigate(ROUTES.productList)}>Quản lí</h6>

                <span>
                    <FontAwesomeIcon 
                        icon={faBell} 
                        className='icon'
                    />
                </span>
            </div>

            <div className='info-box'
                onMouseEnter={() => setIsOpenInfo(true)}
                onMouseLeave={() => setIsOpenInfo(false)}
            >
                <span>
                    <FontAwesomeIcon 
                        icon={faUser} 
                        className='icon'
                    />
                </span>

                {
                    isOpenInfo && (
                        <div
                            className='user-info'
                        >
                            <ul className='list'>
                                <li>
                                    <a>Thông tin tài khoản</a>
                                    <span>{ userInfo.login }</span>
                                </li>

                                <li style={{ cursor: 'pointer' }} onClick={onLogout}>Đăng xuất</li>
                            </ul>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Header;