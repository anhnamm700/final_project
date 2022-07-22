
import { ToastContainer, toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { useNavigate, useLocation } from 'react-router-dom';
import { DateRangePicker } from 'react-date-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTrash, faAngleDown, faAngleUp, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import style from './style.module.scss';
import { ACCESS_TOKEN_KEY } from "utils/constant";
import { pagesNumber, membership, userStatus, userActivity } from 'utils/constant';
import ModalComponent from "modules/components/ModalComponent";
import ToastComponent from "modules/components/ToastComponent";
import PanigationComponent from "modules/components/PanigationComponent";
import SelectComponent from "modules/components/SelectComponent";
import ButtonComponent from "modules/components/ButtonComponent";
import LoadingComponent from "modules/components/LoadingComponent/LoadingComponent";
import { setCountries, setUsers, setRoles } from 'modules/admin/redux/admin';
import { API_PATHS } from "configs/api";
import axiosAPI from "common/axiosConfig/axios";
import InfoComponent from "modules/components/InfoComponent";
import { ROUTES } from "configs/routes";

const UserList = () => {
    const location = useLocation();

    const dispatch = useDispatch();
    const store = useSelector((state: any) => state.admin);
    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const navigate = useNavigate();

    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
    const [isDeleteSuccess, setIsDeleteSuccess] = useState<boolean>(false);
    const [checkedAll, setCheckedAll] = useState<any>([]);
    const [isReload, setIsReload] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState<any>([]);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [userList, setUserList] = useState<any>([]);
    const [isExpandSearch, setIsExpandSearch] = useState<boolean>(false);
    const [isArrangeActive, setIsArrangepActive] = useState<boolean>(false);
    const [isToastDisplay, setIsToastDisplay] = useState<boolean>(false);
    const [search, setSearch] = useState<any>({
        seachKeyword: '',
        membership: [],
        type: [],
        status: [],
        country: '',
        state: '',
        address: '',
        phone: '',
        date_type: 'R',
        date_range: [],
        date_value: '',
        order_by: 'DESC',
        sort: 'last_login'
    });
    const [state, setState] = useState<any>([]);
    const [isMembershipActive, setIsMembershipActive] = useState<boolean>(false);
    const [isUserTypeActive, setIsUserTypepActive] = useState<boolean>(false);
    const [isDateRangeActive, setIsDateRangepActive] = useState<boolean>(false);

    const productsPerPage = Math.ceil(Number(store.users.recordsTotal) / perPage);
    const detailPage = ROUTES.userDetail.slice(0, -3);

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLTextAreaElement;

        if (target.dataset.set !== 'membership') {
            setIsMembershipActive(false);
        }

        if (target.dataset.set !== 'user-type') {
            setIsUserTypepActive(false);
        }
    });

    useEffect(() => {
        const getRoles = async () => {
            try {
                setIsLoading(true);
                const dataRoles = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.getRoles,
                    header: { Authorization: `${auth}` }
                });

                if (!dataRoles?.data?.errors) {
                    dispatch(setRoles(dataRoles.data?.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }

                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }

        const getCountries = async () => {
            try {
                const dataCountries = await axiosAPI({
                    method: 'GET',
                    url: API_PATHS.getCountries,
                    header: { Authorization: `${auth}` }
                });

                if (!dataCountries?.data?.errors) {
                    dispatch(setCountries(dataCountries?.data));
                } else {
                    alert('Có lỗi xảy ra!');
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }

        getCountries();
        getRoles();
    }, [dispatch]);

    useEffect(() => {
        if (!isToastDisplay) window.history.replaceState({}, document.title);
    }, [isToastDisplay]);

    useEffect(() => {
        if (Object(location)?.state?.toast) {
            setIsToastDisplay(true);
        }
    }, [location.state]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setIsLoading(true);
                const status = await Number(search?.status[0]) === 0 ? [] : search?.status;
                const types = await search?.type.map((item: any) => item.id);
                const memberships = await search?.membership.map((item: any) => item.value);

                const dataProducts = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.users,
                    payload: {
                        "page": currentPage,
                        "count": perPage,
                        "search": search.seachKeyword,
                        "memberships": memberships,
                        "types": types,
                        "status": status,
                        "country": search.country,
                        "state": search.state,
                        "address": search.address,
                        "phone": search.phone,
                        "date_type": search.date_type,
                        "date_range": search.date_range,
                        "sort": search.sort,
                        "order_by": search.order_by,
                        "tz": 7
                    },
                    header: { Authorization: `${auth}` }
                });

                if (!dataProducts?.data?.errors) {
                    dispatch(setUsers(dataProducts.data));
                    setUserList(dataProducts.data.data);
                } else {
                    alert('Có lỗi xảy ra!');
                }
                setIsLoading(false);
            } catch (error: any) {
                throw new Error(error);
            }
        }
        getProducts();
    }, [dispatch, perPage, currentPage, isSearch, isReload, isArrangeActive]);

    const handleSearchData = () => {
        setIsSearch(!isSearch);
    }

    const handleCheckedItems = (e: any) => {
        const id = e.target?.parentNode?.dataset?.id;
        const { checked, value } = e.target;

        if (checked) {
            setIsChecked([...isChecked, value]);
        } else {
            setIsChecked(isChecked.filter((item: any) => item !== value));
        }

        if (id) {
            if (isChecked.includes(id)) {
                isChecked.splice(isChecked.indexOf(id), 1);
                setIsChecked([...isChecked]);
            } else {
                setIsChecked([...isChecked, id]);
            }
        }
    }

    const handleDeleteProducts = useCallback(async () => {
        setIsLoading(true);
        if (checkedAll.length === 0 && isChecked.length > 0) {
            try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editUser,
                    payload: { params: [...isChecked.map((item: any) => ({ "id": item, "delete": 1 }))] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    setIsDeleteSuccess(true);
                    setIsReload(!isReload);
                }
            } catch (error: any) {
                throw new Error(error);
            }

        } else if (checkedAll.length > 0) {
            try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editUser,
                    payload: { params: [...checkedAll.map((item: any) => ({ "id": item, "delete": 1 }))] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    setIsDeleteSuccess(true);
                    setIsReload(!isReload);
                }
            } catch (error: any) {
                throw new Error(error);
            }
        } else if (!!Number(deleteId)) {
            try {
                const dataResponse = await axiosAPI({
                    method: 'POST',
                    url: API_PATHS.editUser,
                    payload: { params: [{ "id": deleteId, "delete": 1 }] },
                    header: { Authorization: `${auth}` }
                });

                if (!dataResponse?.data?.errors) {
                    setIsDeleteSuccess(true);
                    setIsReload(!isReload);
                }
            } catch (error: any) {
                throw new Error(error);
            }
        }

        setIsChecked([]);
        setCheckedAll([]);
        setIsModalDelete(false);
        window.scrollTo(0, 0);
        setIsLoading(false);

    }, [checkedAll, isChecked, deleteId]);

    const handleChangeMembership = (e: any) => {
        const { value, title } = e.target;
        setSearch({ ...search, membership: e.target.checked ? [...search.membership, { title: title, value: value }] : (search.membership.filter((item: any) => item.value !== value)) })
    }

    const handleChangeUserType = (e: any) => {
        const { value, title } = e.target;
        setSearch({ ...search, type: e.target.checked ? [...search.type, { id: value, name: title }] : (search.type.filter((item: any) => item.id !== value)) })
    }

    const handleDeleteItem = (e: any) => {
        setDeleteId(e.target.parentNode.dataset.id);
        setIsModalDelete(true);
    }

    const handleGetState = async (e: any) => {
        if (e.target.value === "none") {
            setState([]);
            setSearch({ ...search, country: '', state: '' });
            return;
        }

        try {
            setIsLoading(true);
            setSearch({ ...search, country: e.target.value });

            const dataStates = await axiosAPI({
                method: 'POST',
                url: API_PATHS.getState,
                payload: { code: e.target.value },
                header: { Authorization: `${auth}` }
            });

            if (!dataStates?.data?.errors) {
                setState(dataStates.data.data);
            } else {
                alert('Có lỗi xảy ra!');
            }
            setIsLoading(false);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }

    const handleSelectDate = (e: any) => {
        const startDate = e.selection.startDate;
        const endDate = e.selection.endDate;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        setSearch({ ...search, date_range: [moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD')], date_value: `${startDate.toLocaleDateString('US', options)} - ${endDate.toLocaleDateString('US', options)}` });
        setIsDateRangepActive(false);
    }

    const handleArrange = (e: any) => {
        const keyword = e.target.title;

        const changeArrange = (keyword: string) => {
            if (search?.sort !== keyword) {
                setSearch({ ...search, sort: keyword });
            } else {
                if (search?.order_by !== 'ASC') {
                    setSearch({ ...search, order_by: 'ASC' });
                } else {
                    setSearch({ ...search, order_by: 'DESC' });
                }
            }
        };

        switch (keyword) {
            case 'vendor':
                changeArrange(keyword);
                break;

            case 'fistName':
                changeArrange(keyword);
                break;

            case 'access_level':
                changeArrange(keyword);
                break;

            case 'created':
                changeArrange(keyword);
                break;

            case 'last_login':
                changeArrange(keyword);
                break;

            default:
                break;
        }
        setIsArrangepActive(!isArrangeActive);
    }

    const handleCheckAll = (e: any) => {
        const checked = e.target.checked;
        const indexProducts: string[] = [];

        if (userList) {
            store?.users?.data?.map((user: any) => (
                indexProducts.push(user.profile_id)
            ))
        }

        if (checked) {
            setCheckedAll([...indexProducts]);
            setIsChecked([...indexProducts]);
        } else {
            setCheckedAll([]);
            setIsChecked([]);
        }
    }

    const handleSetCurrentPage = (value: any) => {
        if (typeof (value) === 'number') {
            setCurrentPage(value);
            setIsChecked([]);
        }
    }

    console.log(isChecked);
    

    return (
        <div className="warpper">
            {
                isLoading && <LoadingComponent />
            }

            {
                isToastDisplay && <ToastComponent
                    show={isToastDisplay}
                    setShow={() => setIsToastDisplay(false)}
                    content="Thêm tài khoản thành công!"
                />
            }

            <h2 className="title">Danh sách tài khoản</h2>

            <div>

                {
                    isModalDelete && <ModalComponent
                        isClose={isModalDelete}
                        content="Bạn có muốn xóa trường này không?"
                        onClose={() => setIsModalDelete(false)}
                        onConfirm={handleDeleteProducts}
                    />
                }

                {
                    isDeleteSuccess && <ToastComponent
                        show={isDeleteSuccess}
                        content="Xóa thành công"
                        setShow={() => setIsDeleteSuccess(false)}
                    />
                }

                <div className="box-main-search">
                    <div className="box-search">
                        <InfoComponent
                            type="inputText"
                            placeholder="Seach Keywords"
                            className="homeSearch"
                            onChangeInput={(value) => setSearch({ ...search, seachKeyword: value.target.value })}
                            onKeyUp={(e: any) => {
                                if (e.keyCode === 8) {
                                    if (search?.seachKeyword.trim().length === 0) {
                                        setSearch({ ...search, category: e.target.value })
                                    }
                                }
                            }}
                        />

                        <div className={style.selectMain}>
                            <p
                                className={style.selectHome}
                                data-set="membership"
                                onClick={() => setIsMembershipActive(!isMembershipActive)}
                            >
                                {search?.membership.length === 0 ? "All Membership" : (search?.membership.map((item: any) => item.title).join(", "))}
                            </p>

                            {
                                isMembershipActive ? <FontAwesomeIcon icon={faAngleUp} className={style.iconExpand} /> : <FontAwesomeIcon icon={faAngleDown} className={style.iconExpand} />
                            }

                            {
                                isMembershipActive && (
                                    <div data-set="membership" className={style.optionItem}>
                                        {
                                            membership?.memberships.map((item: any, index: number) => (
                                                <div className={style.memberArea} data-set="membership">
                                                    <p className={style.memberTitle} data-set="membership">{index === 0 ? item.type : ''}</p>
                                                    <div className={style.memberItem} data-set="membership">
                                                        <input checked={search?.membership?.find((member: any) => member.value === item.value) ? true : false} data-set="membership" title={item.title} value={item.value} type="checkbox" id={`${item?.value}${item.type}`} onChange={handleChangeMembership} />
                                                        <label data-set="membership" htmlFor={`${item?.value}${item.type}`}>{item.title}</label>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        {
                                            membership?.pendingMemberships.map((item: any, index: number) => (
                                                <div className={style.memberArea} data-set="membership">
                                                    <p className={style.memberTitle} data-set="membership">{index === 0 ? item.type : ''}</p>
                                                    <div className={style.memberItem} data-set="membership">
                                                        <input checked={search?.membership?.find((member: any) => member.value === item.value) ? true : false} data-set="membership" title={item.title} value={item.value} type="checkbox" id={`${item?.value}${item.type}`} onChange={handleChangeMembership} />
                                                        <label data-set="membership" htmlFor={`${item?.value}${item.type}`}>{item.title}</label>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <div className={style.selectMain}>
                            <p
                                className={style.selectHome}
                                data-set="user-type"
                                onClick={() => setIsUserTypepActive(!isUserTypeActive)}
                            >
                                {search?.type.length === 0 ? "All User Types" : (search?.type.map((item: any) => item.name).join(", "))}
                            </p>

                            {
                                isUserTypeActive ? <FontAwesomeIcon icon={faAngleUp} className={style.iconExpand} /> : <FontAwesomeIcon icon={faAngleDown} className={style.iconExpand} />
                            }

                            {
                                isUserTypeActive && (
                                    <div data-set="user-type" className={style.optionItem}>
                                        {
                                            store?.roles?.administrator?.map((item: any, index: number) => (
                                                <div className={style.memberArea} data-set="user-type">
                                                    <p className={style.memberTitle} data-set="user-type">{index === 0 ? "Membership" : ''}</p>
                                                    <div className={style.memberItem} data-set="user-type">
                                                        <input checked={search?.type?.find((member: any) => member.id === item.id) ? true : false} data-set="user-type" title={item.name} value={item.id} type="checkbox" id={item?.id} onChange={handleChangeUserType} />
                                                        <label data-set="user-type" htmlFor={item?.id}>{item.name}</label>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        {
                                            store?.roles?.customer?.map((item: any, index: number) => (
                                                <div className={style.memberArea} data-set="membership">
                                                    <p className={style.memberTitle} data-set="membership">{index === 0 ? "Membership Pending" : ''}</p>
                                                    <div className={style.memberItem} data-set="membership">
                                                        <input checked={search?.type?.find((member: any) => member.id === item.id) ? true : false} data-set="user-type" title={item.name} value={item.id} type="checkbox" id={item?.id} onChange={handleChangeUserType} />
                                                        <label data-set="user-type" htmlFor={item?.id}>{item.name}</label>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>

                        <SelectComponent
                            className="width250"
                            data={userStatus}
                            onSelectChange={(e: any) => setSearch({ ...search, status: [...e.target.value] })}
                        />

                        <ButtonComponent
                            variant="primary"
                            value="Search"
                            type="submit"
                            icon=""
                            size="m"
                            onClick={handleSearchData}
                        />
                    </div>

                    {
                        isExpandSearch && (
                            <div className={style.expandSearch}>
                                <div className="d-flex flex-column search-in">
                                    <div className={`${style.contryArera} d-flex align-items-center`}>
                                        <p className={style.title}>Country: </p>
                                        <select className={style.selectCountry} onChange={handleGetState}>
                                            <option value="none">Select country</option>
                                            {
                                                store?.countries.map((item: any) => (
                                                    <option key={item.code} value={item.code}>{item.country}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className={`${style.contryArera} d-flex align-items-center`}>
                                        <p className={style.title}>State: </p>
                                        {
                                            state.length > 0 ? (
                                                <select className={style.selectCountry} onChange={(e: any) => setSearch({ ...search, state: e.target.value })}>
                                                    {state.map((item: any) => (
                                                        <option key={item.state} value={item.state}>{item.state}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input value={search.state} onChange={(e: any) => setSearch({ ...search, state: e.target.value })} className={style.selectCountry} type="text" />
                                            )

                                        }
                                    </div>

                                    <div className={`${style.contryArera} d-flex align-items-center`}>
                                        <p className={style.title}>Address: </p>
                                        <input value={search.address} onChange={(e: any) => setSearch({ ...search, address: e.target.value })} className={style.selectCountry} type="text" />
                                    </div>

                                    <div className={`${style.contryArera} d-flex align-items-center`}>
                                        <p className={style.title}>Phone: </p>
                                        <input value={search.phone} onChange={(e: any) => setSearch({ ...search, phone: e.target.value })} className={style.selectCountry} type="text" />
                                    </div>
                                </div>

                                <div className={style.searchDate}>
                                    <div className="d-flex search-in">
                                        <p className="title">User activity:</p>
                                        <div className="d-flex flex-column">
                                            {
                                                userActivity?.map((item: any) => (
                                                    <label htmlFor={item?.id}>
                                                        <input key={item?.id} id={item?.id} type="radio" name="userActivity" checked={search.date_type === item?.id} value={item?.id} onChange={(e) => setSearch({ ...search, date_type: e.target.value })} />
                                                        {item?.name}
                                                    </label>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="d-flex search-in">
                                        <input type="text" value={search?.date_value} placeholder="Enter date range" onFocus={() => setIsDateRangepActive(true)} />
                                        {
                                            isDateRangeActive && (
                                                <DateRangePicker
                                                    className={style.dateRange}
                                                    ranges={[selectionRange]}
                                                    onChange={handleSelectDate}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }


                </div>

                <div className="expand-btn">
                    <ButtonComponent
                        variant=""
                        value=""
                        type="button"
                        icon={isExpandSearch ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                        size="n"
                        onClick={() => setIsExpandSearch(!isExpandSearch)}
                    />
                </div>
            </div>

            <div>
                <ButtonComponent
                    variant="primary"
                    value="Thêm tài khoản"
                    type="button"
                    icon=""
                    size="m"
                    onClick={() => navigate(ROUTES.addUser)}
                />
                <div className="table-box">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={handleCheckAll}
                                        value="all"
                                    />
                                </th>
                                <th className="widthTable300"></th>
                                <th className="widthTable500"><span title="fistName" onClick={handleArrange}>Tên {search.sort === "fistName" ? (search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />) : ''} </span></th>
                                <th className="widthTable500"><span title="access_level" onClick={handleArrange}>Cấp độ truy cập {search.sort === "access_level" ? (search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />) : ''} </span></th>
                                <th className="widthTable300"><span>Products</span></th>
                                <th className="widthTable300"><span>Orders</span></th>
                                <th className="widthTable300"><span>Wishlish</span></th>
                                <th className="widthTable300"><span title="created" onClick={handleArrange}>Ngày tạo {search.sort === "created" ? (search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />) : ''} </span></th>
                                <th className="widthTable300"><span title="last_login" onClick={handleArrange}>Ngày đăng nhập cuối cùng {search.sort === "last_login" ? (search.order_by === "DESC" ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />) : ''} </span></th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                userList?.map((item: any, index: number) => (
                                    <tr key={item.profile_id} id={item.profile_id} data-active={item.enabled} className={isChecked.includes(item.profile_id) ? style.disabledTr : style.activeTr}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={item.profile_id}
                                                checked={isChecked?.find((check: any) => check === item.profile_id) ? true : false}
                                                onChange={handleCheckedItems}
                                            />
                                        </td>
                                        <td><span className={style.userItem} onClick={() => navigate(`${detailPage}${item.profile_id}`)}>{item.vendor}</span></td>
                                        <td>{`${item?.firstName ? item?.firstName : ''} ${item?.lastName ? item?.lastName : ''}`}</td>
                                        <td>{item.access_level}</td>
                                        <td>{item.product}</td>
                                        <td>{item.order?.order_as_buyer}</td>
                                        <td>{item.wishlist}</td>
                                        <td>{moment(item?.created * 1000).format('MMM D, YYYY, HH:mmA')}</td>
                                        <td>{moment(item?.last_login * 1000).format('MMM D, YYYY, HH:mmA')}</td>
                                        <td data-id={item?.profile_id}>
                                            <ButtonComponent
                                                variant=""
                                                value=""
                                                type="button"
                                                icon={<FontAwesomeIcon icon={faTrash} className={style.buttonIcon} />}
                                                size={isChecked?.includes(item.profile_id) ? 'd' : 'n'}
                                                onClick={handleCheckedItems}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>


                    </table>
                </div>

                <div className="tfoot">
                    <div className="panigation">
                        <PanigationComponent
                            pages={productsPerPage}
                            changeTotal={perPage}
                            setCurrentPage={handleSetCurrentPage}
                        />
                    </div>

                    <div className={`changeNumber d-flex align-items-center`}>
                        <p>{store.users.recordsTotal} Items</p>
                        <SelectComponent
                            className="width80"
                            data={pagesNumber}
                            onSelectChange={(e: any) => {
                                setPerpage(Number(e.target.value));
                                setIsChecked([]);
                            }}
                        />
                    </div>

                </div>
                <div className="deleteBox">
                    <button onClick={() => setIsModalDelete(true)} disabled={isChecked.length === 0 && checkedAll.length === 0 ? true : false} className={isChecked.length === 0 && checkedAll.length === 0 ? "deleteButton" : "deleteButton active"}>Delete</button>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default UserList;