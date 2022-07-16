import { Modal, Button } from 'react-bootstrap';

interface Props {
    isClose: boolean,
    content: string,
    onClose: () => void,
    onConfirm: () => void
}

const ModalComponent = (props: Props) => {
    const { isClose, content, onClose, onConfirm } = props;

    return (
        <Modal
            show={isClose}
            onHide={onClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { content }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Hủy bỏ
            </Button>
            <Button variant="primary" onClick={onConfirm}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalComponent;