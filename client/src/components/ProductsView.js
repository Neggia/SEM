import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import {
  SERVER_BASE_URL,
  CONTROLLER_PRODUCT_ID,
  VIEW_PRODUCT_ITEMS_PER_PAGE,
  CONTROLLER_PRODUCT_TITLE,
} from '../utils/globals';
import Pagination from '@mui/material/Pagination';
// import { fetchProducts } from '../api'; // Assume you have an API function to fetch products

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(VIEW_PRODUCT_ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
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
        console.log(
          'TaskManager processDataResponseJson: ',
          productResponseJson,
        );
        setProducts(productResponseJson.data);
        setTotalPages(productResponseJson.totalPages);
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      }
    }

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleSearchChange = (event) => {
    async function fetchData() {
      try {
        const fetchUrl =
          SERVER_BASE_URL +
          CONTROLLER_PRODUCT_ID +
          CONTROLLER_PRODUCT_TITLE +
          `?&search=${event.target.value}`;
        const searchChangeResponse = await fetch(fetchUrl);
        if (!searchChangeResponse.ok) {
          throw new Error(
            'Network response was not ok ' + searchChangeResponse.statusText,
          );
        }
        const searchChangeResponseJson = await searchChangeResponse.json();
        console.log('searchChangeResponseJson: ', searchChangeResponseJson);

        setSearchTerm(event.target.value);
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      }
    }

    fetchData();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    // Filter products based on category
  };

  return (
    <>
      <ProductGrid
        products={products}
        onSearch={handleSearchChange}
        onFilterChange={handleCategoryChange}
        categories={['Category 1', 'Category 2', 'Category 3']} // Example categories
      />
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
      />
    </>
  );
};

export default ProductsView;
