import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import style from './style.module.scss';

interface Props {
    name: string,
    route?: any
}

const Header = (props: Props) => {
    const { name, route } = props;

    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column">
            <button className={style.backBtn} onClick={() => navigate(route)}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <h2 className={style.productName}>{ name }</h2>
        </div>
    );
}

export default memo(Header);