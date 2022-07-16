import { Spinner } from 'react-bootstrap';

import './style.css';

const LoadingComponent = () => {
    return (
        <div className='wrapper-spinner'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default LoadingComponent;