import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import Switch from "react-switch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';
import moment from 'moment';


import style from './style.module.scss';
import { ACCESS_TOKEN_KEY, memberShipUser } from 'utils/constant';
import { userValidate } from 'utils/validate';
import axiosAPI from 'common/axiosConfig/axios';
import CKEditorComponent from 'modules/components/CKEditor';
import InputCheckboxComponent from 'modules/components/InputCheckboxComponent';
import InfoComponent from 'modules/components/InfoComponent';
import ReactSelectComponent from 'modules/components/ReactSelectComponent';
import LoadingComponent from 'modules/components/LoadingComponent/LoadingComponent';
import MultiFileComponent from 'modules/components/MultiFileComponent';
import Header from 'modules/admin/components/General/Header';
import Content from 'modules/admin/components/General/Content';
import { API_PATHS } from 'configs/api';
import CheckBoxComponent from 'modules/components/CheckBoxComponent';
import InputComponent from 'modules/components/InputComponent';
import SelectComponent from 'modules/components/SelectComponent';
import ReactSelect from 'react-select';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState<any>({});
    const [errorMessage, setErrorMessage] = useState<any>({});
    const [userInfo, setUserInfo] = useState<any>({
        access_level: "",
        companyName: "",
        default_card_id: "",
        earning: 0,
        email: "",
        expense: "0",
        firstName: "",
        first_login: "",
        forceChangePassword: "",
        income: "",
        joined: "",
        language: "en",
        lastName: "",
        last_login: "",
        membership_id: null,
        order_as_buyer: 0,
        order_as_buyer_total: 0,
        paymentRailsId: "",
        paymentRailsType: "",
        pending_membership_id: null,
        products_total: "",
        profile_id: "",
        referer: "http://instagram.com/",
        roles: [],
        status: "E",
        statusComment: "",
        taxExempt: "",
        vendor_id: "",
        password: '',
        confirm_password: ''
    });
    const [accStatus, setAccStatus] = useState<any>({});
    const [accRoles, setAccRoles] = useState<any[]>([]);
    const [isUserTypeActive, setIsUserTypepActive] = useState<boolean>(false);

    
    const [updatedComplete, setUpdatedComplete] = useState<any>(null);
    const [updatedSuccess, setUpdatesSuccess] = useState<boolean>(false);
    const [isDisplay, setIsDisplay] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const auth = Cookies.get(ACCESS_TOKEN_KEY);

    

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLTextAreaElement
        if (target.dataset.set !== 'input-select') {
            setIsDisplay(false);
        }

        
         if (target.dataset.set !== 'user-type') {
            setIsUserTypepActive(false);
        }
    });


    useEffect(() => {
        try {
            const activeChange = async () => {
                try {
                    const userDetail = await axiosAPI({ method: 'post', url: `${API_PATHS.detailUser}`, payload: { id: id }, header: { Authorization: `${auth}` } });

                    if (!userDetail?.data?.errors || userDetail.data.success) {
                        const { account_roles, account_status, info } = userDetail?.data?.data;
                        
                        setAccRoles(account_roles);
                        setAccStatus(account_status);
                        setUser(info);
                    } else {
                        alert('Có lỗi xảy ra!');
                    }


                    setIsLoading(false);

                } catch (error: any) {
                    throw new Error(error);
                    
                }
            }

            activeChange();
        } catch (error: any) {
            throw new Error(error);
        }
    }, [id, updatedComplete]);
    

    useEffect(() => {
        setUserInfo({
            ...userInfo,
            access_level: user?.access_level,
            companyName: user?.companyName,
            default_card_id: user?.default_card_id,
            earning: user?.earning,
            email: user?.email,
            expense: user?.expense,
            firstName: user?.firstName,
            first_login: user?.first_login,
            forceChangePassword: user?.forceChangePassword,
            income: user?.income,
            joined: user?.joined,
            language: user?.language,
            lastName: user?.lastName,
            last_login: user?.last_login,
            membership_id: user?.membership_id,
            order_as_buyer: user?.order_as_buyer,
            order_as_buyer_total: user?.order_as_buyer_total,
            paymentRailsId: user?.paymentRailsId,
            paymentRailsType: user?.paymentRailsType,
            pending_membership_id: user?.pending_membership_id,
            products_total: user?.products_total,
            profile_id: user?.profile_id,
            referer: user?.referer,
            roles: user?.roles?.map((item: any) => {
                const result = accRoles.reduce((acc: any, elm: any) => {
                    if (elm.id === item) {
                        return elm;
                    }
                    return acc;
                });
                return result;
            }),
            status: user?.status,
            statusComment: user?.statusComment,
            taxExempt: user?.taxExempt,
            vendor_id: user?.vendor_id,
        });
    }, [user, accRoles]);

    useEffect(() => {
        if (errorMessage?.firstName?.length === 0 && errorMessage?.lastName?.length === 0
            && errorMessage?.email?.length === 0 && errorMessage?.password?.length === 0 &&  errorMessage?.rePassword?.length === 0) {
            setIsUpdate(false);
        } else {
            setIsUpdate(true);
        }
    }, [errorMessage]);
    
    

    const handleUpdate = useCallback(async () => {
        setIsLoading(true);
        try {
            const productDetail = await {
                email: userInfo?.email,
                firstName: userInfo?.firstName,
                forceChangePassword: Number(userInfo?.forceChangePassword),
                lastName: userInfo?.lastName,
                membership_id: userInfo?.membership_id,
                password: userInfo?.password,
                confirm_password: userInfo?.confirm_password,
                roles: userInfo?.roles.map((item: any) => Number(item.id)),
                status: userInfo?.status,
                statusComment: userInfo?.statusComment,
                taxExempt: userInfo?.taxExempt,
                id: id
            }

            const userPresponse = await axiosAPI({
                method: 'POST',
                url: API_PATHS.editUser,
                payload: { params: [productDetail] },
                header: { Authorization: `${auth}` }
            });

            if (!userPresponse?.data?.errors) {
                alert('Cập nhật thành công');
                setUpdatedComplete(!updatedComplete);
                window.scrollTo(0, 0);
            }

        } catch (error: any) {
            throw new Error(error);
        }   
        setIsLoading(false);
    }, [userInfo]);

    const handleChangeUserType = (e: any) => {
        const { value, title } = e.target;
        setUserInfo({ ...userInfo, roles: e.target.checked ? [...userInfo.roles, { id: value, name: title } ] : (userInfo.roles.filter((item: any) => item.id !== value)) })
    }


    return (
        <div className={style.detailWrapper}>
            {
                isLoading && <LoadingComponent />
            }

            <Header
                name={user?.email}
            />

            <div className={style.infoWrapper}>
                <div className={style.titleHeader}>
                    <ul>
                        <li>Info</li>
                    </ul>

                    <div className={style.ProductComponent}>
                        <div className={style.contentInfo}>
                            <div className={`d-flex`}>
                                <p>Orders placed as a buyer: </p>
                                <span>{ userInfo?.order_as_buyer }</span>
                            </div>

                            <div className={`d-flex`}>
                                <p>Vendor Income: </p>
                                <span>${ userInfo?.income }</span>
                            </div>

                            <div className={`d-flex`}>
                                <p>Vendor Expense: </p>
                                <span>${ userInfo?.expense }</span>
                            </div>

                            <div className={`d-flex`}>
                                <p>Earning balance: </p>
                                <span>${ userInfo?.earning }</span>
                            </div>

                            <div className={`d-flex`}>
                                <p>Products listed as vendor: </p>
                                <span>{ userInfo?.products_total }</span>
                            </div>
                        </div>

                        <div className={style.contentInfo}>
                            <h6>Email & password</h6>
                            <div className={`d-flex flex-column`}>
                                <div className={`d-flex`}>
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

                                <div className={`d-flex`}>
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

                                <div className={`d-flex`}>
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

                                <div className={`d-flex`}>
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

                                <div className={`d-flex`}>
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
                                </div>

                                <div className={`d-flex`}>
                                    <p>PaymentRails ID: </p>
                                    <span>{ userInfo?.default_card_id }</span>
                                </div>
                            </div>
                        </div>

                        <div className={style.contentInfo}>
                            <h6>Access information</h6>
                            <div className={`d-flex flex-column`}>
                                <div className={`d-flex`}>
                                    <p>Access level: </p>
                                    <span>{ userInfo?.access_level }</span>
                                </div>

                                <div className={`d-flex ${style.selectMain}`}>
                                    <p>Roles: </p>
                                    <span 
                                        className={style.selectHome} 
                                        data-set="user-type"
                                        onClick={() => setIsUserTypepActive(!isUserTypeActive)}
                                    >
                                        { userInfo?.roles?.length === 0 ? "" : (userInfo?.roles?.map((item: any) => item.name).join(", ")) }

                                        
                                    </span>

                                    {
                                            isUserTypeActive ? <FontAwesomeIcon icon={faAngleUp} className={style.iconExpand} /> : <FontAwesomeIcon icon={faAngleDown}  className={style.iconExpand} />
                                        }

                                    {
                                        isUserTypeActive && (
                                            <div data-set="user-type" className={style.optionItem}>
                                                {
                                                    
                                                    accRoles.map((item: any, index: number) => (
                                                        <div className={style.memberArea} data-set="user-type">
                                                            <p className={style.memberTitle} data-set="user-type">{ index === 0 ? "Membership" : '' }</p>
                                                            <div className={style.memberItem} data-set="user-type">
                                                                <input checked={userInfo?.roles?.find((member: any) => member.id === item.id) ? true : false} data-set="user-type" title={item.name} value={item.id} type="checkbox" id={item?.id} onChange={handleChangeUserType}/>
                                                                <label data-set="user-type" htmlFor={item?.id}>{ item.name }</label>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Account status *</p>
                                    <select onChange={(e: any) => setUserInfo({ ...userInfo, status: e.target.value })} className={style.optionOther} >
                                        <option selected={userInfo?.status === "E"} value="E">{ accStatus.E }</option>
                                        <option selected={userInfo?.status === "D"} value="D">{ accStatus.D }</option>
                                        <option selected={userInfo?.status === "U"} value="U">{ accStatus.U }</option>
                                    </select>

                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Status comment (reason): </p>
                                    <textarea className={style.optionOther} value={userInfo?.statusComment} onChange={(e: any) => setUserInfo({ ...userInfo, statusComment: e.target.value })}></textarea>
                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Membership: </p>
                                    <select className={style.optionOther} onChange={(e: any) => setUserInfo({ ...userInfo, membership_id: e.target.value })}>
                                        {
                                            memberShipUser?.map((item: any) => (
                                                <option selected={userInfo?.membership_id === item.id} value={item.id}>{ item.name }</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className={`d-flex ${style.infoArea}`}>
                                    <p>Pending membership: </p>
                                    <span>{ userInfo?.pending_membership_id || 'None'  }</span>
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
                    <button disabled={isUpdate} className={style.updateButton} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;