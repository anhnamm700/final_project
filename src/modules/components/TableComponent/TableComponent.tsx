import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faTrash, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';
import moment from 'moment';

import { ROUTES } from 'configs/routes';
import CheckBoxComponent from "modules/components/CheckBoxComponent";
import ButtonComponent from 'modules/components/ButtonComponent';
import style from 'modules/components/TableComponent/style.module.scss';

interface Props {
    data: any,
    isChecked?: any[],
    isActive?: boolean,
    checked?: boolean,
    checkedToDel: any[],
    onActive: (e: any) => void,
    setCheckedSearch: (e: any) => void,
    deleteItem?: (e: any) => void,
    setPriceItem: (id: number, value: string) => any,
    setQuantityItem: (id: number, value: string) => any
}

const TableComponent = (props: Props) => {
    const { data, isChecked, checked, isActive, checkedToDel, onActive, setCheckedSearch, deleteItem, setPriceItem, setQuantityItem } = props;
    const navigate = useNavigate();
    const detailPage = ROUTES.productDetail.slice(0, -3);
    const userDetail = ROUTES.userDetail.slice(0, -3);

    return (
        <Fragment>
            <tbody>
                {
                    data?.map((item: any, index: number) => (
                        <tr key={item.id} id={item.id} data-active={item.enabled} className={checkedToDel.includes(item.id) ? style.disabledTr : style.activeTr}>
                            <td>
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    checked={isChecked?.find((check: any) => check === item.id) ? true : false}
                                    onChange={setCheckedSearch}
                                />
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faPowerOff} values={item.id} className={ item.enabled === '0' ? `${style.powerIcon}` : `${style.active} ${style.powerIcon}` } onClick={onActive} />
                            </td>
                            <td>{ item.sku }</td>
                            <td><p onClick={() => navigate(`${detailPage}${item.id}`) } style={{ cursor: 'pointer', color: '#3498db' }}>{ item?.name?.slice(0, 40) }</p></td>
                            <td>{ item?.category?.slice(0, 46) }</td>
                            <td>
                                <NumberFormat
                                    value={item.price}
                                    className={style.inputChange}
                                    displayType={checkedToDel?.includes(item.id) ? 'text' : 'input'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    onValueChange={(values, sourceInfo) => {
                                        const { formattedValue, value } = values;
                                        setPriceItem(index, value);
                                        const { event, source } = sourceInfo;
                                    }}
                                />
                            </td>
                            <td>
                                <NumberFormat
                                    value={item.amount}
                                    className={style.inputChange}
                                    displayType={checkedToDel?.includes(item.id) ? 'text' : 'input'}
                                    thousandSeparator={true}
                                    prefix={''}
                                    onValueChange={(values, sourceInfo) => {
                                        const { formattedValue, value } = values;
                                        setQuantityItem(index, value);
                                        const { event, source } = sourceInfo;
                                    }}
                                />
                            </td>
                            <td><span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate(`${userDetail}${item.vendorID}`)}>{ item.vendor }</span></td>
                            <td>{ moment(item?.arrivalDate * 1000).format('MMM D, YYYY') }</td>
                            <td data-id={item?.id}>
                                <ButtonComponent
                                    variant=""
                                    value=""
                                    type="button"
                                    icon={<FontAwesomeIcon icon={faTrash} className={style.buttonIcon} />}
                                    size={checkedToDel?.includes(item.id) ? 'd' : 'n'}
                                    onClick={deleteItem} 
                                />
                                
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Fragment>
    );
}

export default TableComponent;