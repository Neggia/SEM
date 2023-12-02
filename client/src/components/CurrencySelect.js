import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Checkbox } from '@mui/material';
import { SERVER_BASE_URL, CONTROLLER_CURRENCY_ID } from '../utils/globals';

const CurrencySelect = ({ setCurrencies, selectedItems, setSelectedItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  //   const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const currencyResponse = await fetch(
        SERVER_BASE_URL + CONTROLLER_CURRENCY_ID,
      );
      if (!currencyResponse.ok) {
        throw new Error(
          'Network response was not ok ' + currencyResponse.statusText,
        );
      }
      const currencyResponseJson = await currencyResponse.json();
      console.log(
        'CurrencySelect currencyResponseJson: ',
        currencyResponseJson,
      );
      setItems(currencyResponseJson);
      setCurrencies(currencyResponseJson);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToggle = (itemId) => {
    const currentIndex = selectedItems.indexOf(itemId);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(itemId);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Currency
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {items.map((item) => {
          const itemLabel = [item.name, item.symbol, item.ticker]
            .filter(Boolean)
            .join(' ');

          return (
            <MenuItem key={item.id} onClick={() => handleToggle(item.id)}>
              <Checkbox checked={selectedItems.includes(item.id)} />
              {itemLabel || 'Unnamed Item'}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default CurrencySelect;