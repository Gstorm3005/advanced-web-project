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
  ImageList,
  ImageListItem,
  Box,
  Alert,
  Snackbar,
  ImageListItemBar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { DeleteOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

ProductEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleMessage: PropTypes.func,
  handleMessageShow: PropTypes.func,
  editId: PropTypes.number,
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
  reference: Yup.string().required('La référence est requise'),
  title: Yup.string().required('Le titre est requis'),
  price: Yup.number().required('Le prix est requis').positive('Le prix doit être positif'),
  quantity: Yup.number().required('La quantité est requise').min(1, 'La quantité doit être d\'au moins 1'),
  description: Yup.string().required('La description est requise'),
});

export default function ProductEdit({ open, handleClose, handleMessage, handleMessageShow, editId }) {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [croppingImage, setCroppingImage] = useState(null);
  const [croppingImageName, setCroppingImageName] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [uploading, setUploading] = useState(false); // Added uploading state
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const handleCloseAdd = async () => {
    handleClose()
    formik.resetForm();
    setCroppingImage(null)
    setCroppingImageName(null)
    setImages([])
    setNewImages([])
    try {
      await Promise.all(newImages.map(async (imageName) => {
        const response = await axios.delete(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product/image/${imageName}`);
        if (response.data.error) {
          console.error(`Error deleting image ${imageName}: ${response.data.error}`);
        }
      }));
    } catch (error) {
      console.error('Error deleting images:', error);
    }

  }
  useEffect(() => {
    if(open){
      axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product/${editId}`)
        .then((response) => {
          if (response.data.error) {
            console.error(response.data.error);
          } else {
            formik.values.title = response.data.title
            formik.values.reference = response.data.reference
            formik.values.price = response.data.price
            formik.values.quantity = response.data.quantity
            formik.values.description = response.data.description
          }
        })
        .catch((error) => {
          console.error(error);
      });

     

      
      
      axios.get(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product/images/${editId}`)
        .then((response) => {
          if (response.data.error) {
            console.error(response.data.error);
          } else {
            setImages(response.data.imagePaths);
          }
        })
        .catch((error) => {
          console.error(error);
      });  
    }
    // eslint-disable-next-line
  }, [open]);

 

  const handleFileUpload = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'webp'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
  
      if (!validExtensions.includes(fileExtension)) {
        setOpenSnackbar(true)
        setErrorMessage("Type de fichier invalide")
        return;
      }
      if (images.some(element => element === file.name)) {
        setOpenSnackbar(true)
        setErrorMessage("Cette image a été deja ajouter")
        return;
      }
  
      setCroppingImage(URL.createObjectURL(file));
      setCroppingImageName(file.name);
    }
  };

  const handleCrop = async () => {
    if (cropper) {
      setUploading(true); // Set uploading state to true when cropping starts
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          const formData = new FormData();
          formData.append('image', blob); // Append the cropped image blob to the form data
          // Send the cropped image to the server
          const response = await axios.post(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product/upload/${croppingImageName}`, formData);
  
          if (response.data.success) {
            // Append the uploaded image file object to the images state
            setImages((prevImages) => [...prevImages, response.data.fileName]);
            setNewImages((prevImages) => [...prevImages, response.data.fileName]);
            setCroppingImage(null);
          } else {
            setOpenSnackbar(true)
            setErrorMessage(response.data.error)
            setCroppingImage(null);
            setUploading(false);
          }
        } catch (error) {
          console.error(error);
          setOpenSnackbar(true)
          setErrorMessage(error)
        } finally {
          setUploading(false); // Set uploading state to false when cropping ends
        }
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      reference: '',
      title: '',
      price: '',
      quantity: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      
      

      try {

        const response = await axios.put(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product`, { values, images, id: editId});
        if (response.data.error) {
          console.error(response.data.error);
          formik.resetForm();
          setCroppingImage(null)
          setImages([])
          handleMessage(response.data)
          handleMessageShow(true)
          handleClose();
        } else {
          formik.resetForm();
          setCroppingImage(null)
          setImages([])
          handleMessage(response.data)
          handleMessageShow(true)
          handleClose();
        }
      } catch (error) {
        console.error(error);
        formik.resetForm();
        setCroppingImage(null)
        setImages([])
        handleMessage(error)
        handleMessageShow(true)
        handleClose();
      }
    }
    
  });
  const deleteImage = async (path) => {
    try{
      const response = await axios.delete(`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/product/image/${path}`);
      if (response.data.message) {
        setImages(prevImages => prevImages.filter(image => image !== path));
        handleMessage(response.data)
        handleMessageShow(true)
      } 
    } catch (error) {
        console.error(error);
        handleMessage(error)
        handleMessageShow(true)
      }
    
    
  }

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
            Modifier le produit N°{editId}
          </Typography>
          <Button autoFocus sx={{ mr: 2 }} variant='contained' color="inherit" onClick={handleCloseAdd}>
            Annuler
          </Button>
          <Button type="submit" autoFocus variant='contained' color="primary" onClick={formik.handleSubmit}>
            Sauvegarder
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 5 }}>
        <Container>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="reference"
                  label="Reference"
                  fullWidth
                  value={formik.values.reference}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.reference && Boolean(formik.errors.reference)}
                  helperText={formik.touched.reference && formik.errors.reference}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="title"
                  label="Titre"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="price"
                  label="Prix"
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
                  label="Quantité"
                  type="number"
                  fullWidth
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
             
            </Grid>
            {!croppingImage && (
              <Box>
                <Button
                  sx={{mt: 2}}
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Files
                  <VisuallyHiddenInput accept=".jpg,.jpeg,.png,.bmp,.webp"  type="file" name="images" onChange={handleFileUpload} multiple />
                </Button>
                {images.length > 0 && (
                  <ImageList sx={{ width: '100%', height: '100%',mt: 2 }} variant="masonry" cols={3}>
                  {images.map((file, index) => (
                    <ImageListItem key={index} sx={{ display: 'flex'}}>
                      <img src={`http://${process.env.REACT_APP_LOCAL_IP_ADDRESS}:${process.env.REACT_APP_LOCAL_PORT}/thumbnail/${file}`} alt={`Uploaded ${index}`} />
                      <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={file}
              position="top"
              actionIcon={
                <IconButton
                  color='error'
                  onClick={() => {deleteImage(file)}}
                >
                  <DeleteOutline />
                </IconButton>
              }
              actionPosition="left"
            />
                    </ImageListItem>
                    
                  ))}
                </ImageList>
                )}
              </Box>
            
            )}
            {/* Display LinearProgress while uploading */}
            
            {/* Cropper Component */}
            {croppingImage && (
              <Box sx={{mt: 2}}>
                {uploading ?
                <LoadingButton sx={{mr: 1,mb: 1}} loading  variant="contained" color="primary">
                Crop
                
                </LoadingButton>
                :
                <Button sx={{mr: 1,mb: 1}} onClick={handleCrop} variant="contained" color="primary">
                Crop
                
                </Button> 
                }
                <Button sx={{mb: 1}} onClick={() => {setCroppingImage(null)}} variant="contained" color="inherit">
                Annuler
                
                </Button>
                <Cropper
                  src={croppingImage}
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
            {/* Display ImageList after successful upload */}
            
          </form>
        </Container>
      </DialogContent>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=> {setOpenSnackbar(false)}}>
  <Alert
    onClose={()=> {setOpenSnackbar(false)}}
    severity="error"
    variant="filled"
    sx={{ width: '100%' }}
  >
    {errorMessage}
  </Alert>
</Snackbar>
    </Dialog>
  );
}
