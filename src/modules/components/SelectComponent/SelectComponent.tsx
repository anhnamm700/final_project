import { Fragment } from 'react';

import style from './style.module.scss';
import React from 'react';

interface Props {
    data: any,
    className?: string,
    selected?: any,
    onSelectChange?: (e: any) => any
}

const SelectComponent = (props: Props) => {
    const { data, className, selected, onSelectChange } = props;
    const realData = Array.isArray(data) ? data : data?.data;
    
    

    return (
        <select className={className ? style[className] : ''} onChange={onSelectChange}>
            { typeof(realData?.[0]) === 'string' || typeof(realData?.[0]) === 'number' || data?.type ? '' : <option value="0">Any Category</option> }

            {
                realData?.map((item: any, index: number) => {
                    return (
                        <option key={index} value={item.id ? item.id : item} selected={Number(selected) === Number(item.id) ? true : false}>{ item.name ? item.name : item }</option>
                    );
                })
            }
        </select>
    );
}

export default SelectComponent;