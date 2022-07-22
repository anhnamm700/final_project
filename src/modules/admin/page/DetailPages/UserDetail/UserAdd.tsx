import { useCallback, useEffect, useState } from 'react';
import Redirect, { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';


import style from './style.module.scss';
import { ACCESS_TOKEN_KEY, memberShipUser, typeAcc, permissionAcc } from 'utils/constant';
import { userValidate } from 'utils/validate';
import axiosAPI from 'common/axiosConfig/axios';
import InfoComponent from 'modules/components/InfoComponent';
import ToastComponent from 'modules/components/ToastComponent';
import LoadingComponent from 'modules/components/LoadingComponent/LoadingComponent';
import Header from 'modules/admin/components/General/Header';
import { API_PATHS } from 'configs/api';
import SelectComponent from 'modules/components/SelectComponent';
import { ROUTES } from 'configs/routes';

const UserAdd = () => {
    const [errorMessage, setErrorMessage] = useState<any>({});
    const [userInfo, setUserInfo] = useState<any>({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirm_password: '',
        membership_id: memberShipUser[0]?.id,
        forceChangePassword: '',
        taxExempt: '',
        paymentRailsType: typeAcc?.data[0]?.id,
        access_level: permissionAcc?.data[0]?.id,
        roles: []
    });
    const [isUserTypeActive, setIsUserTypepActive] = useState<boolean>(false);
    const [isSpinner, setIsSpinner] = useState<boolean>(false);
    const [isRolesActive, setIsRolesActive] = useState<boolean>(false);
    const [isDisplay, setIsDisplay] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);

    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const store = useSelector((state: any) => state.admin);
    const navigate = useNavigate();

    const roles = store?.roles?.administrator;


    document.addEventListener('click', (e) => {
        const target = e.target as HTMLTextAreaElement
        if (target.dataset.set !== 'input-select') {
            setIsDisplay(false);
        }


        if (target.dataset.set !== 'user-type') {
            setIsUserTypepActive(false);
        }
    });

    const handleUpdate = async () => {
        setIsLoading(true);
        setIsSpinner(true);
        try {
            const userDetail = {
                email: userInfo?.email,
                firstName: userInfo?.firstName,
                lastName: userInfo?.lastName,
                password: userInfo?.password,
                confirm_password: userInfo?.confirm_password,
                membership_id: userInfo?.membership_id === 'null' ? '' : userInfo?.membership_id,
                forceChangePassword: Number(userInfo?.forceChangePassword),
                taxExempt: Number(userInfo?.taxExempt),
                paymentRailsType: userInfo?.paymentRailsType,
                access_level: userInfo?.access_level,
                roles: userInfo?.roles.map((item: any) => item.id)
            }

            const userPresponse = await axiosAPI({
                method: 'POST',
                url: API_PATHS.createUser,
                payload: userDetail,
                header: { Authorization: `${auth}` }
            });

            if (!userPresponse?.data?.errors) {
                setIsAddSuccess(true);
            }

        } catch (error: any) {
            throw new Error(error);
        }
        setIsLoading(false);
    };

    const handleChangeUserType = (e: any) => {
        const { value, title } = e.target;
        setUserInfo({ ...userInfo, roles: e.target.checked ? [...userInfo.roles, { id: value, name: title }] : (userInfo.roles.filter((item: any) => item.id !== value)) })
    }

    useEffect(() => {
        if (isAddSuccess) {
            navigate(ROUTES.userList, { state: { toast: 'Thêm người dùng thành công' } });
            setIsAddSuccess(false);
            setIsSpinner(false);
        }
    }, [isAddSuccess]);

    return (
        <div className={style.detailWrapper}>
            <ToastContainer/>

            {
                isLoading && <LoadingComponent />
            }

            <Header
                name="Create Account"
                route={ROUTES.userList}
            />

            <div className={style.infoWrapper}>
                <div className={style.titleHeader}>
                    <ul>
                        <li>Info</li>
                    </ul>

                    <div className={style.ProductComponent}>
                        <div className={style.contentInfo}>
                            <h6>Email & password</h6>
                            <div className={`d-flex flex-column`}>
                                <div className={`d-flex ${style.relative}`}>
                                    <InfoComponent
                                        type='inputText'
                                        title='First Name'
                                        isImportant={true}
                                        value={userInfo?.firstName}
                                        onChangeInput={(e: any) => {
                                            setUserInfo({ ...userInfo, firstName: e.target.value });
                                            setErrorMessage(userValidate({ ...userInfo, firstName: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.firstName ? <div className={style.messageError}>{errorMessage.firstName}</div> : null}
                                </div>

                                <div className={`d-flex ${style.relative}`}>
                                    <InfoComponent
                                        type='inputText'
                                        title='Last Name'
                                        isImportant={true}
                                        value={userInfo?.lastName}
                                        onChangeInput={(e: any) => {
                                            setUserInfo({ ...userInfo, lastName: e.target.value });
                                            setErrorMessage(userValidate({ ...userInfo, lastName: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.lastName ? <div className={style.messageError}>{errorMessage.lastName}</div> : null}
                                </div>

                                <div className={`d-flex ${style.relative}`}>
                                    <InfoComponent
                                        type='inputText'
                                        title='Email'
                                        isImportant={true}
                                        dataType='email'
                                        value={userInfo?.email}
                                        onChangeInput={(e: any) => {
                                            setUserInfo({ ...userInfo, email: e.target.value });
                                            setErrorMessage(userValidate({ ...userInfo, email: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.email ? <div className={style.messageError}>{errorMessage.email}</div> : null}
                                </div>

                                <div className={`d-flex ${style.relative}`}>
                                    <InfoComponent
                                        type='inputText'
                                        title='Password'
                                        isImportant={false}
                                        dataType='password'
                                        value={userInfo?.password}
                                        onChangeInput={(e: any) => {
                                            setUserInfo({ ...userInfo, password: e.target.value });
                                            setErrorMessage(userValidate({ ...userInfo, password: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.password ? <div className={style.messageError}>{errorMessage.password}</div> : null}
                                </div>

                                <div className={`d-flex ${style.relative}`}>
                                    <InfoComponent
                                        type='inputText'
                                        title='Confirm Password'
                                        isImportant={false}
                                        dataType='password'
                                        value={userInfo?.confirm_password}
                                        onChangeInput={(e: any) => {
                                            setUserInfo({ ...userInfo, confirm_password: e.target.value });
                                            setErrorMessage(userValidate({ ...userInfo, rePassword: e.target.value }));
                                        }}
                                    />
                                    {errorMessage.rePassword ? <div className={style.messageError}>{errorMessage.rePassword}</div> : null}
                                </div>

                                <div className={`d-flex`}>
                                    <p>Type: </p>

                                    <SelectComponent
                                        data={typeAcc}
                                        className="width320h"
                                        onSelectChange={(e: any) => setUserInfo({ ...userInfo, paymentRailsType: e.target.value })}
                                    />
                                </div>

                                <div className={`d-flex`}>
                                    <p>PaymentRails ID: </p>
                                </div>
                            </div>
                        </div>

                        <div className={style.contentInfo}>
                            <h6>Access information</h6>
                            <div className={`d-flex flex-column`}>
                                <div className={`d-flex  ${style.relative}`}>
                                    <p>Access level: </p>
                                    <SelectComponent
                                        data={permissionAcc}
                                        className="width320h"
                                        onSelectChange={(e: any) => {
                                            const value = e.target.value;
                                            setUserInfo({ ...userInfo, access_level: value });
                                            if (Number(value) === 100) {
                                                setIsRolesActive(true);
                                            } else if (Number(value) !== 100) {
                                                setIsRolesActive(false);
                                            }
                                        }}
                                    />
                                </div>

                                {
                                    isRolesActive && (
                                        <div className={`d-flex ${style.selectMain} ${style.selectMainHidden}`}>
                                            <p>Roles: </p>
                                            <span
                                                className={style.selectHome}
                                                data-set="user-type"
                                                onClick={() => setIsUserTypepActive(!isUserTypeActive)}
                                            >
                                                {userInfo?.roles?.length === 0 ? "" : (userInfo?.roles?.map((item: any) => item.name).join(", "))}


                                            </span>

                                            {
                                                isUserTypeActive ? <FontAwesomeIcon icon={faAngleUp} className={style.iconExpand} /> : <FontAwesomeIcon icon={faAngleDown} className={style.iconExpand} />
                                            }

                                            {
                                                isUserTypeActive && (
                                                    <div data-set="user-type" className={style.optionItem}>
                                                        {

                                                            roles.map((item: any, index: number) => (
                                                                <div className={style.memberArea} data-set="user-type">
                                                                    <p className={style.memberTitle} data-set="user-type">{index === 0 ? "Membership" : ''}</p>
                                                                    <div className={style.memberItem} data-set="user-type">
                                                                        <input checked={userInfo?.roles?.find((member: any) => member.id === item.id) ? true : false} data-set="user-type" title={item.name} value={item.id} type="checkbox" id={item?.id} onChange={handleChangeUserType} />
                                                                        <label data-set="user-type" htmlFor={item?.id}>{item.name}</label>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Membership: </p>
                                    <select className={style.optionOther} onChange={(e: any) => setUserInfo({ ...userInfo, membership_id: e.target.value })}>
                                        {
                                            memberShipUser?.map((item: any) => (
                                                <option selected={userInfo?.membership_id === item.id} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Pending membership: </p>
                                    <span>{userInfo?.pending_membership_id || 'None'}</span>
                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <label htmlFor='forceChangePassword'>Require to change password on next log in: </label>
                                    <input
                                        type="checkbox"
                                        className={style.optionOther}
                                        id="forceChangePassword"
                                        value={userInfo?.forceChangePassword}
                                        checked={Number(userInfo?.forceChangePassword) === 1}
                                        onChange={(e: any) => {
                                            if (e.target.checked) {
                                                setUserInfo({ ...userInfo, forceChangePassword: '1' });
                                            } else {
                                                setUserInfo({ ...userInfo, forceChangePassword: '0' });
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>

                        <div className={style.contentInfo}>
                            <h6>Tax information</h6>
                            <div className={`d-flex flex-column`}>
                                <div className={`d-flex`}>
                                    <label htmlFor='taxExempt'>Tax exempt: </label>
                                    <input
                                        type="checkbox"
                                        className={style.optionOther}
                                        value={userInfo?.taxExempt}
                                        id="taxExempt"
                                        checked={Number(userInfo?.taxExempt) === 1}
                                        onChange={(e: any) => {
                                            if (e.target.checked) {
                                                setUserInfo({ ...userInfo, taxExempt: '1' });
                                            } else {
                                                setUserInfo({ ...userInfo, taxExempt: '0' });
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${style.flexComponent} ${style.socialOption}`}>
                    <button disabled={userInfo?.firstName?.length === 0 || userInfo?.lastName?.length === 0 || userInfo?.email?.length === 0 || isSpinner} className={userInfo?.firstName?.length === 0 || userInfo?.lastName?.length === 0 || userInfo?.email?.length === 0 || isSpinner ? style.disableBtn : style.updateButton} onClick={handleUpdate}>Update</button>
                    {
                        isSpinner && <Spinner animation="border" className={style.spinner} />
                    }
                </div>
                
            </div>
        </div>
    );
}

export default UserAdd;