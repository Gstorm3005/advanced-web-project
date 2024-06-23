import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
import { ProductListHead, ProductListToolbar} from '../sections/@dashboard/component';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
];

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterTitle, setFilterTitle] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((product) => product._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTitle = (event) => {
    setPage(0);
    setFilterTitle(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_IP_ADDRESS}/components`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        apikey: process.env.REACT_APP_API_KEY,
      },
    })
    .then((response) => {
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setProducts(response.data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  const filteredProducts = filter(products, (product) =>
    product.name.toLowerCase().includes(filterTitle.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (orderBy === 'name' || orderBy === 'code') {
      return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
    }
    return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
  });

  const isNotFound = !filteredProducts.length && !!filterTitle;

  return (
    <>
      <Helmet>
        <title>Product | Minimal UI</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Components
          </Typography>
        </Stack>

        <Card>
          <ProductListToolbar
            numSelected={selected.length}
            filterTitle={filterTitle}
            onFilterTitle={handleFilterByTitle}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ProductListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {sortedProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      const { _id, name, code } = product;
                      const selectedProduct = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedProduct}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedProduct} onChange={(event) => handleClick(event, _id)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{code}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterTitle}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}