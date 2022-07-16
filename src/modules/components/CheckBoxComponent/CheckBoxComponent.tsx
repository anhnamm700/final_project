import { useEffect, useState } from 'react';
import style from './style.module.scss';

interface Props {
    title?: string
    value: any,
    className?:  string,
    isCheckedItem?: any[],
    setCheckedSearch: (value: any) => any
}

const CheckBoxComponent = (props: Props) => {
    const { title, value, className, isCheckedItem, setCheckedSearch } = props;
    
    const [isChecked, setIsChecked] = useState<any>(!!Number(value));

    const onChecked = (e: any) => {
        setIsChecked(!isChecked);
        setCheckedSearch(e);
    }

    return (
        <div className={ title ? 'd-flex' : '' }>
            <input
                type="checkbox"
                value={value}
                id={`${value}${title}`}
                className={className ? style[className] : ''}
                checked={value === "1" || value === true ? true : false}
                onChange={onChecked}
            />
            { title && <label className={style.label} htmlFor={`${value}${title}`}>{title}</label> }
        </div>
    );
}

export default CheckBoxComponent;