import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { arrayToDataUrl } from '../utils/globals';

const ProductGrid = ({ products, onSearch, onFilterChange, categories }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Search" onChange={onSearch} variant="outlined" />
          <Select onChange={onFilterChange} defaultValue="" displayEmpty>
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
                {/* Additional Product Info */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductGrid;
