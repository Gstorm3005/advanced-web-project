import PropTypes from 'prop-types';
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
  Alert,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState, forwardRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { LoadingButton } from '@mui/lab';

ProductAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
};

const Transition = forwardRef((props, ref) =>
  <Slide direction="up" ref={ref} {...props} />
);

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
});

export default function ProductAdd({ open, handleClose, handleMessage, handleMessageShow }) {
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingImageUrl, setCroppingImageUrl] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseAdd = () => {
    handleClose();
    formik.resetForm();
    setCroppingImage(null);
    setCroppingImageUrl(null);
    setCroppedImageUrl(null);
  };

  const handleFileUpload = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'svg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        setOpenSnackbar(true);
        setErrorMessage("Invalid file type");
        return;
      }

      setCroppingImage(file);
      setCroppingImageUrl(URL.createObjectURL(file));
      setCroppedImageUrl(null);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      setUploading(true);
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedUrl = URL.createObjectURL(blob);
        setCroppedImageUrl(croppedUrl);
        setCroppingImage(blob);
        setCroppingImageUrl(null); // Hide the Cropper component
        setUploading(false);
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      price: '',
      quantity: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('category', values.category);
        formData.append('price', values.price);
        formData.append('quantity', values.quantity);
        formData.append('image', croppingImage);

        const response = await axios.post(`${process.env.REACT_APP_IP_ADDRESS}/articles`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            accessToken: localStorage.getItem("accessToken"),
            apikey: process.env.REACT_APP_API_KEY,
          },
        });

        if (response.data.error) {
          console.error(response.data.error);
          setErrorMessage(response.data.error);
          handleMessage(response.data);
          handleMessageShow(true);
          handleClose();
        } else {
          formik.resetForm();
          setCroppingImage(null);
          setCroppedImageUrl(null);
          handleMessage(response.data);
          handleMessageShow(true);
          handleClose();
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
        handleMessage(error.message);
        handleMessageShow(true);
        handleClose();
      }
    }
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar color="inherit" sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleCloseAdd} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add an Article
          </Typography>
          <Button autoFocus sx={{ mr: 2 }} variant='contained' color="inherit" onClick={handleCloseAdd}>
            Cancel
          </Button>
          <Button type="submit" autoFocus variant='contained' color="primary" onClick={formik.handleSubmit}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 5 }}>
        <Container>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="name"
                  label="Name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="category"
                  label="Category"
                  fullWidth
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  fullWidth
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>
              {!croppingImageUrl && !croppedImageUrl && (
                <Box>
                  <Button
                    sx={{ mt: 2 }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <VisuallyHiddenInput accept=".jpg,.jpeg,.png,.bmp,.webp,.svg" type="file" name="image" onChange={handleFileUpload} />
                  </Button>
                </Box>
              )}
              {croppingImageUrl && (
                <Box sx={{ mt: 2 }}>
                  {uploading ? (
                    <LoadingButton sx={{ mr: 1, mb: 1 }} loading variant="contained" color="primary">
                      Crop
                    </LoadingButton>
                  ) : (
                    <Button sx={{ mr: 1, mb: 1 }} onClick={handleCrop} variant="contained" color="primary">
                      Crop
                    </Button>
                  )}
                  <Button sx={{ mb: 1 }} onClick={() => { setCroppingImage(null); setCroppingImageUrl(null); }} variant="contained" color="inherit">
                    Cancel
                  </Button>
                  <Cropper
                    src={croppingImageUrl}
                    style={{ height: 400, width: '100%' }}
                    initialAspectRatio={1}
                    aspectRatio={1}
                    guides={false}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={Boolean(true)}
                    autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                  />
                </Box>
              )}
              {croppedImageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img src={croppedImageUrl} alt="Cropped" style={{ width: '100%' }} />
                  <Button sx={{ mt: 2 }} onClick={() => { setCroppedImageUrl(null); setCroppingImageUrl(null); }} variant="contained" color="inherit">
                    Change Image
                  </Button>
                </Box>
              )}
            </Grid>
          </form>
        </Container>
      </DialogContent>
      
    </Dialog>
  );
}
