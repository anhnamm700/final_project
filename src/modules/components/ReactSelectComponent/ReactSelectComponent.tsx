import { useState } from 'react';
import Select from 'react-select';

import style from './style.module.scss';


interface Props {
    options: any,
    value?: any,
    isMulti: boolean,
    className: string,
    onChange?: (e: any) => any
}

const ReactSelectComponent = (props: Props) => {
    const { options, value, isMulti, className, onChange} = props;
    
    return (
        <div className={style[className]}>
            <Select 
                options={options} 
                value={value}
                onChange={onChange}
                isMulti={isMulti ? true : false}
                className={style.itemInfoComponent}
            />
        </div>
    )
}

export default ReactSelectComponent;
