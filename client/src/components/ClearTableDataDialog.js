import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import axios from 'axios';
import {
  SERVER_BASE_URL,
  CONTROLLER_FIXTURES_ID,
  CONTROLLER_FIXTURES_SYNC,
  displayFlashMessage,
} from '../utils/globals';

const ClearTableDataDialog = ({
  open,
  handleClose,
  //, items
  flashMessageDivId,
}) => {
  const items = [
    'SemProduct',
    'SemHtmlElementStructure',
    'SemHtmlElement',
    'SemWebsite',
    'SemProcess',
    'SemOpenaiCompletionsRequest',
    'SemOpenaiCompletions',
    // 'SemCategory',
    'SemCurrency',
  ];
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (item) => {
    setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] });
  };

  const handleConfirm = async () => {
    // console.log('Selected Items:', checkedItems);
    // Create an array of item names where the value is true
    const selectedItems = Object.keys(checkedItems).filter(
      (item) => checkedItems[item],
    );
    console.log('Selected Items:', selectedItems);

    const fixturesDto = {
      deleteEntities: selectedItems,
    };

    const response = await axios
      .post(
        SERVER_BASE_URL + CONTROLLER_FIXTURES_ID + CONTROLLER_FIXTURES_SYNC,
        fixturesDto,
      )
      .then((response) => {
        // Handle success
        console.log('Success:', response.data);
        // Optionally, display a success message
        displayFlashMessage('Table data cleared', 'success', flashMessageDivId);
      })
      .catch((error) => {
        // Handle errors
        let errorMessage = 'An error occurred';
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        displayFlashMessage(errorMessage, 'error', flashMessageDivId);
      });

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Attention! The selected table data will be ERASED and reset with the
        default data, are you sure?
      </DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          {items.map((item) => (
            <Grid item key={item}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!checkedItems[item]}
                    onChange={() => handleCheck(item)}
                  />
                }
                label={item}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearTableDataDialog;
