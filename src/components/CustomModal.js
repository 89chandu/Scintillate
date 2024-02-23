import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';

function CustomModal({ isOpen, onClose, title, message }) {
    useEffect(() => {
        let timeoutId;
        if (isOpen) {
            timeoutId = setTimeout(() => {
                onClose();
            }, 3000);
        }

        return () => clearTimeout(timeoutId);
    }, [isOpen, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">{title}</ModalHeader>
                <ModalBody textAlign="center">
                    <p>{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose} mx="auto">
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CustomModal;
