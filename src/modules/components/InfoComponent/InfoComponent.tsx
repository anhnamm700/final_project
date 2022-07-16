import { useState, memo } from 'react';

import { InputGroup, Form, Placeholder } from 'react-bootstrap';

import InputComponent from "modules/components/InputComponent";
import SelectComponent from "modules/components/SelectComponent";
import CheckBoxComponent from "modules/components/CheckBoxComponent";
import style from './style.module.scss';

interface Props {
    isImportant?: boolean,
    title?: string,
    type: string,
    unit?: any,
    value?: any,
    placeholder?: string,
    dataSet?: string,
    dataSelect?: any,
    selected?: any,
    name?: string,
    dataType?: string,
    className?: string,
    onChangeInput?: (e: any) => void,
    onFocus?: () => void,
    onKeyUp?: (e: any) => void,
    onBlur?: (e: any) => void,
    onClick?: (e: any) => void,
    onSelectChange?: (e: any) => void,
}

const InfoComponent = (props: Props) => {
    const { 
        dataSelect, 
        isImportant, 
        title, 
        type, 
        unit, 
        dataSet, 
        value, 
        placeholder, 
        selected,
        name,
        dataType,
        className,
        onChangeInput, 
        onKeyUp, 
        onBlur, 
        onFocus, 
        onClick,
        onSelectChange,
    } = props;

    // const [checked, setChecked] = useState(false);
    // const handleChange = (nextChecked: any) => {
    //     setChecked(nextChecked);
    // };

    return (
        <div className={className ? style[className] : style.InfoComponent}>
            <div className={className ? style[`${className}Title`] : style.titleInfo}>
                <p>{ title }{ isImportant ? '*' : '' }</p>
            </div>

            <div className={className ? style[className] : style.InfoComponent}>
                { 
                    type === 'inputText' && 
                    <InputGroup className={className ? style[className] : style.itemInfoComponent}>
                        { unit ? <InputGroup.Text id="basic-addon1">{unit}</InputGroup.Text> : '' }
                        <Form.Control
                            type={dataType}
                            placeholder={placeholder}
                            aria-label="Username"
                            name={name}
                            aria-describedby="basic-addon1"
                            value={value}
                            data-set={dataSet}
                            min={0}
                            className={className ? style[`${className}Input`] : ''}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onChange={onChangeInput}
                            onKeyUp={onKeyUp}
                            onClick={onClick}
                        />
                    </InputGroup>
                }

                {
                    type === 'select' &&
                    <SelectComponent
                        className="itemInfoComponent"
                        // className="width300"
                        data={dataSelect} 
                        selected={selected}
                        onSelectChange={onSelectChange}
                    />
                }

                {
                    type === 'checkbox' && 
                    <CheckBoxComponent
                        className={style.itemInfoComponent}
                        title="Name"
                        value="name"
                        setCheckedSearch={() => {}}
                    />
                }
            </div>
        </div>
    );
}

export default memo(InfoComponent);