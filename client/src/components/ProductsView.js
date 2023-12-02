import React, { useState, useEffect, useRef } from 'react';
// import ProductGrid from './ProductGrid';
import CurrencySelect from './CurrencySelect';
import {
  SERVER_BASE_URL,
  CONTROLLER_PRODUCT_ID,
  VIEW_PRODUCT_ITEMS_PER_PAGE,
  CONTROLLER_PRODUCT_TITLE,
} from '../utils/globals';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Pagination,
  Menu,
  Button,
  Box,
} from '@mui/material';
import { arrayToDataUrl } from '../utils/globals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import { fetchProducts } from '../api'; // Assume you have an API function to fetch products

const SearchIcon = () => <FontAwesomeIcon icon={faMagnifyingGlass} />;

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(VIEW_PRODUCT_ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchFieldRef = useRef(null);

  const debounceDelay = 300; // 300 milliseconds

  let searchDebounceTimeout = null;

  const fetchData = async () => {
    try {
      console.log('ProductsView selectedCurrencies: ', selectedCurrencies);

      const productResponse = await fetch(
        SERVER_BASE_URL +
          CONTROLLER_PRODUCT_ID +
          `?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
      );
      if (!productResponse.ok) {
        throw new Error(
          'Network response was not ok ' + productResponse.statusText,
        );
      }
      const productResponseJson = await productResponse.json();
      console.log('ProductsView productResponseJson: ', productResponseJson);
      setProducts(productResponseJson.data);
      setTotalPages(productResponseJson.totalPages);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue.length < 3) {
      setSearchResults([]);
      setAnchorEl(null);
      return;
    }

    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
      fetchSearchChangeData(searchValue);
    }, debounceDelay);
  };

  const fetchSearchChangeData = async (searchValue) => {
    try {
      const fetchUrl =
        SERVER_BASE_URL +
        CONTROLLER_PRODUCT_ID +
        CONTROLLER_PRODUCT_TITLE +
        `?&search=${searchValue}`;
      const searchChangeResponse = await fetch(fetchUrl);
      if (!searchChangeResponse.ok) {
        throw new Error(
          'Network response was not ok ' + searchChangeResponse.statusText,
        );
      }
      const searchChangeResponseJson = await searchChangeResponse.json();
      console.log('searchChangeResponseJson', searchChangeResponseJson);

      setSearchResults(searchChangeResponseJson); // Assuming this is an array
      if (searchChangeResponseJson.length > 0) {
        setAnchorEl(searchFieldRef.current);
      } else {
        setAnchorEl(null);
      }
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    }
  };

  const selectSearchResult = (result) => {
    setSearchTerm(result);
    setSearchResults([]);
    setAnchorEl(null);
  };

  // Function to get currency string by ID
  const getCurrencyStringById = (currencyId) => {
    const currency = currencies.find((c) => c.id === currencyId);
    return currency
      ? [currency.name, currency.symbol, currency.ticker]
          .filter(Boolean)
          .join(' ')
      : 'Unknown currency';
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    // Filter products based on category
  };

  const categories = ['Category 1', 'Category 2', 'Category 3'];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <TextField
              label="Search"
              onChange={handleSearchChange}
              variant="outlined"
              inputRef={searchFieldRef} // Assign the ref to the TextField
            />
            <Select
              onChange={handleCategoryChange}
              defaultValue=""
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {/* Additional Filters */}
            <CurrencySelect
              setCurrencies={setCurrencies}
              selectedItems={selectedCurrencies}
              setSelectedItems={setSelectedCurrencies}
            />
            <Button
              variant="contained" // Use 'contained' for a filled button
              color="primary" // Use the theme's primary color
              onClick={() => fetchData()}
              startIcon={<SearchIcon />}
              style={{
                height: '100%', // Adjust the height as needed
                marginLeft: 8, // Add some margin if needed
              }}
            >
              Search
            </Button>
          </Box>
        </Grid>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <a href={product.url} target="_blank" rel="noopener noreferrer">
                <CardMedia
                  component="img"
                  height="140"
                  image={arrayToDataUrl(
                    product.thumbnail ? product.thumbnail.data : null,
                  )} // Convert buffer to data URL
                  alt={product.title}
                />
              </a>

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.title}
                </Typography>
                {/* Displaying price information only if it's greater than 0 */}
                {(product.price_01 || product.price_01 === 0) &&
                  product.price_01 > 0 && (
                    <Typography variant="body1" color="textSecondary">
                      Price: {product.price_01}{' '}
                      {getCurrencyStringById(product.currency_01_id)}
                    </Typography>
                  )}
                {(product.price_02 || product.price_02 === 0) &&
                  product.price_02 > 0 && (
                    <Typography variant="body1" color="textSecondary">
                      {product.price_01 > 0
                        ? 'Alternate/additional Price:'
                        : 'Price:'}{' '}
                      {product.price_02}{' '}
                      {getCurrencyStringById(product.currency_02_id)}
                    </Typography>
                  )}
                {/* Additional Product Info */}
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Dropdown for Search Results */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl && searchResults.length > 0)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {searchResults.map((product, index) => (
            <MenuItem key={index}>
              <button
                onClick={() => window.open(product.url, '_blank')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  color: 'inherit',
                  textTransform: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                {product.title}
              </button>
            </MenuItem>
          ))}
        </Menu>
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
      />
    </>
  );
};

export default ProductsView;