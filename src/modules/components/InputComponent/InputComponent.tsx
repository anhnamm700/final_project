
import { useEffect, useState, useRef } from 'react';
import { InputGroup, Form } from 'react-bootstrap';

import style from './style.module.scss';

interface Props {
    unit?: any,
    placeholder?: string,
    type?: string,
    className?: string,
    time?: number,
    inputRef?: any,
    data?: any,
    setValueInput: (value: string) => any,
    onKeyDown?: (value: any) => void,
    onKeyUp?: (value: any) => void
}

const InputComponent = (props: Props) => {
    const { unit, placeholder, type, data, className, time, inputRef, onKeyDown, onKeyUp, setValueInput } = props;

    const [value, setValue] = useState('');

    useEffect(() => {
        if (inputRef) {
            setValue(inputRef);
        }
    }, [inputRef]);

    useEffect(() => {
        if (value) {
            const id = setTimeout(() => {
                setValueInput(value);
            }, time);

            return () => clearTimeout(id);
        }
    }, [value])

    
    return (
        <InputGroup className={className ? `${style[className]} mb-3 ${style.defaultInput}` : `mb-3 ${style.defaultInput}`}>
            { unit ? <InputGroup.Text id="basic-addon1">{unit}</InputGroup.Text> : '' }
            <Form.Control
                type={type}
                placeholder={placeholder}
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        </InputGroup>
    );
}

export default InputComponent;