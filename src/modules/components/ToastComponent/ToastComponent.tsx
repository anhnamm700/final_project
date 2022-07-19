
import { ToastContainer } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

interface Props {
    show: boolean,
    content: string,
    setShow: () => void
}

function ToastComponent(props: Props) {
    const { show, content, setShow } = props;

    return (
        <Row>
            <ToastContainer className="p-3" position='top-end' containerPosition='fixed' style={{ marginTop: '100px' }}>
                <Toast onClose={() => setShow()} show={show} delay={3000} autohide >
                    <Toast.Header>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <h5 className="me-auto">Thông báo</h5>
                    </Toast.Header>
                    <Toast.Body>{ content }</Toast.Body>
                </Toast>
            </ToastContainer>
        </Row>
    );
}

export default ToastComponent;