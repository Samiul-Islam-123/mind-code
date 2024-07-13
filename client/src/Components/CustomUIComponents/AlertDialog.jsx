import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({Type, buttonName,Dialogtitle, DialogText, AgreeContent, DisagreeContent, confirmation, setConfirmation}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button color={Type==='error' && 'error'} variant="outlined" onClick={handleClickOpen}>
        {buttonName}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {Dialogtitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {DialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color={Type==='error' && 'error'} onClick={() => {
            setOpen(false)
            setConfirmation(true)
          }}>{AgreeContent}</Button>
          <Button onClick={() => {
             setOpen(false)
             setConfirmation(false)
          }} autoFocus>
            {DisagreeContent}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
