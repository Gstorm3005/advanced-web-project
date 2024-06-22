import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Card, Link, Typography, Stack, Popover, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import MenuDialog from './MenuDialog'
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default function ShopProductCard({ product }) {
  const [openDialog, setOpenDialog] = useState(false)
  const { name, path, price, status, Article } = product;


  const handleClick = (event) => {
    setOpenDialog(true)
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false)
  };


  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={name} src={`http://localhost:5010/uploads/${path}`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" onClick={handleClick}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
      <MenuDialog open={openDialog} handleClose={handleCloseDialog} Article={Article} />
     
    </Card>
  );
}
