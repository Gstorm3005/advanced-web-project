// components/OrderDetailsDialog.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function OrderDetailsDialog({ open, onClose, order }) {
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Client Address: {order.Client.address}</Typography>
        <Typography variant="h6">Order Price: ${order.price}</Typography>
        <Typography variant="h6">Order State: {sentenceCase(order.state.replace(/_/g, ' '))}</Typography>
        
        <Typography variant="h6" mt={2}>Articles Ordered</Typography>
        {order.Article.map((article) => (
          <Stack key={article.articleId} direction="row" justifyContent="space-between">
            <Typography>{article.name} (x{article.quantity})</Typography>
            <Typography>${article.price}</Typography>
          </Stack>
        ))}
        <Typography variant="subtitle1">Total: ${calculateTotalPrice(order.Article)}</Typography>

        <Typography variant="h6" mt={2}>Menus Ordered</Typography>
        {order.Menu.map((menu) => (
          <Accordion key={menu.menuId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{menu.name} (x{menu.quantity})</Typography>
              <Typography>${menu.price}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {menu.Article.map((article) => (
                <Stack key={article.articleId} direction="row" justifyContent="space-between">
                  <Typography>{article.name} (x{article.quantity})</Typography>
                  <Typography>${article.price}</Typography>
                </Stack>
              ))}
              <Typography variant="subtitle1">Menu Total: ${calculateTotalPrice(menu.Article)}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
