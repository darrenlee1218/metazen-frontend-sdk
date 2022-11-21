import React, { ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';
import MuiModal from '@mui/material/Modal';
import { SizingProps } from '@mui/system';

interface ModalContextProps {
  handleClose: (event: object, reason: string) => void;
}

const ModalContext = React.createContext<ModalContextProps>({} as ModalContextProps);

export const useModal = (): ModalContextProps => useContext<ModalContextProps>(ModalContext);

interface ModalProps extends SizingProps {
  children: ReactNode;
  handleClose: (event: object, reason: string) => void;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, handleClose, isOpen, width, height }) => {
  const style = {
    p: 0,
    top: '50%',
    left: '50%',
    boxShadow: 24,
    display: 'flex',
    width: width || 360,
    position: 'absolute',
    height: height || 480,
    flexDirection: 'column',
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
  };

  return (
    <ModalContext.Provider
      value={{
        handleClose,
      }}
    >
      <MuiModal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>{children}</Box>
      </MuiModal>
    </ModalContext.Provider>
  );
};

export default Modal;
