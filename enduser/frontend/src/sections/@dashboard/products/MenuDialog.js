import {
  Button,
  Dialog,
  styled,
  DialogContent,
  TextField,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Box,
  Snackbar,
  Card,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, forwardRef } from 'react';

import { fCurrency } from '../../../utils/formatNumber';

const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  });
  

const Transition = forwardRef((props, ref) =>
    <Slide direction="up" ref={ref} {...props} />
  );

export default function FullScreenDialog({open, handleClose, Article }) {



  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}

      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Articles
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid sx={{p:2}} container spacing={3}>
            {Array.isArray(Article) && Article.map((article) => (
              <Grid item xs={12} sm={6} md={3} key={article._id}>
                <Card>
                  <Box sx={{ pt: '100%', position: 'relative' }}>
                    <StyledProductImg alt={article.name} src={`http://localhost:5010/uploads/${article.path}`} />
                  </Box>
                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Typography variant="subtitle2" noWrap>
                      {article.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {/* <ColorPreview colors={colors} /> */}
                        {article.category}
                        <Typography variant="subtitle1">
                            {/* <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through',
                            }}
                            >
                            {priceSale && fCurrency(priceSale)}
                            </Typography> */}
                            &nbsp;
                            {fCurrency(article.price)}
                        </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
      </Dialog>
    </>
  );
}