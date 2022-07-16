import { Button } from 'react-bootstrap';

import './style.css';

interface Props {
    variant: string,
    value: string,
    size: string,
    type: 'button' | 'reset' | 'submit',
    icon?: any,
    valueItem?: any,
    onClick?: (e: any) => void
}

const ButtonComponent = (props: Props) => {
    const { variant, value, size, icon, type, valueItem, onClick } = props;

    

    return (
        <Button 
            variant={variant}
            className={`${size} default`}
            type={type}
            onClick={onClick}
            value={valueItem}
        >   
            {icon}
            <span className='title'>{value}</span>
        </Button>
    );
}

export default ButtonComponent;

