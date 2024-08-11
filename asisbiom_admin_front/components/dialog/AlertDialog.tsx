import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function AlertDialog({ message_title, message, onAccept, onCancel, setOpen, open }: { open: boolean, setOpen: (open: boolean) => void, message: string, message_title: string, onAccept: () => void, onCancel?: () => void }) {

    const handleClose = () => {

        if (onCancel) onCancel();
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {message_title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={() => { onAccept(); handleClose(); }} autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
