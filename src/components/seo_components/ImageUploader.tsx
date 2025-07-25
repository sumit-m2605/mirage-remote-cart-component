import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import NovusSnackbar from "../Novus-MUI-wrappers/NovusSnackbar";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
  Crop as CropIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { NovusInput, NovusDropdown } from "../Novus-MUI-wrappers";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  onDelete: () => void;
  label?: string;
  aspectRatio?: string;
  minimumResolution?: { width: number; height: number };
  maximumResolution?: { width: number; height: number };
  maxSize?: number; // in KB
  fileTypes?: string[];
  namespace?: string;
  fileName?: string;
  showGallery?: boolean;
  fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onDelete,
  label = "image",
  aspectRatio = "*",
  minimumResolution = { width: 200, height: 200 },
  maximumResolution = { width: 2400, height: 1200 },
  maxSize = 2048,
  fileTypes = ["png", "jpeg", "webp", "bmp"],
  namespace = "misc",
  fileName = "Image",
  showGallery = true,
  fetchGalleryImages,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "url" | "gallery">("upload");
  const [imageUrl, setImageUrl] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [galleryPagination, setGalleryPagination] = useState({ page: 0, nextPage: 1, limit: 16 });
  const [imageSource, setImageSource] = useState("namespace_images");

  // Load gallery images when dialog opens
  useEffect(() => {
    if (dialogOpen && showGallery && fetchGalleryImages && galleryImages.length === 0) {
      fetchGalleryImagesFromBackend("", true);
    }
  }, [dialogOpen, showGallery, fetchGalleryImages]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setImageUrl(value);
    setError("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setImageUrl(value);
    setError("");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileTypes.includes(fileExtension || '')) {
      setError(`Invalid file type. Accepted types: ${fileTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024) {
      setError(`File size too large. Maximum size: ${formatBytes(maxSize * 1024)}`);
      return;
    }

    setLoading(true);
    setError("");

    // Simulate file upload (replace with actual upload logic)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
    setError("");
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      setError("Please provide an image URL or upload a file");
      return;
    }

    onChange(imageUrl);
    setDialogOpen(false);
    setSnackbarMessage("Image saved successfully");
    setShowSnackbar(true);
  };

  const handleDelete = () => {
    onDelete();
    setDialogOpen(false);
    setSnackbarMessage("Image deleted successfully");
    setShowSnackbar(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileTypes.includes(fileExtension || '')) {
        setError(`Invalid file type. Accepted types: ${fileTypes.join(', ')}`);
        return;
      }

      if (file.size > maxSize * 1024) {
        setError(`File size too large. Maximum size: ${formatBytes(maxSize * 1024)}`);
        return;
      }

      setLoading(true);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Fetch gallery images from backend
  const fetchGalleryImagesFromBackend = async (searchText?: string, resetPagination = false) => {
    if (!fetchGalleryImages || !namespace) {
      console.warn('fetchGalleryImages function or namespace is required');
      return;
    }

    // Reset pagination if needed (for source change or new search)
    if (resetPagination) {
      setGalleryPagination({ page: 0, nextPage: 1, limit: 16 });
    }

    if (galleryPagination.nextPage === null) return;

    setGalleryLoading(true);
    setGalleryError("");

    try {
      const params = {
        page: resetPagination ? 1 : galleryPagination.page + 1,
        limit: galleryPagination.limit,
        source: imageSource, // Pass the current source
        ...(searchText && { search: searchText })
      };

      const response = await fetchGalleryImages(namespace, params);
      
      if (response?.data?.items) {
        const newImages = response.data.items.map((item: any) => ({
          text: item.file_name || item.name || item.text,
          secure_url: item.cdn?.url || item.secure_url || item.url,
          thumbnail_url: item.cdn?.url || item.secure_url || item.url,
          ...item
        }));

        if (resetPagination) {
          setGalleryImages(newImages);
        } else {
          setGalleryImages(prev => [...prev, ...newImages]);
        }
        
        setGalleryPagination(prev => ({
          ...prev,
          page: resetPagination ? 1 : prev.page + 1,
          nextPage: response.data.nextPage
        }));
      }
    } catch (err: any) {
      console.error('Failed to fetch gallery images:', err);
      setGalleryError(err.message || 'Failed to load images');
    } finally {
      setGalleryLoading(false);
    }
  };

  // Load gallery images when gallery mode is selected
  const handleGalleryModeSelect = () => {
    setUploadMode("gallery");
    if (galleryImages.length === 0) {
      fetchGalleryImagesFromBackend("", true);
    }
  };

  // Handle gallery search
  const handleGallerySearch = (searchText: string) => {
    fetchGalleryImagesFromBackend(searchText, true);
  };

  // Handle image source change
  const handleImageSourceChange = (newSource: string) => {
    setImageSource(newSource);
    setGalleryImages([]); // Clear current images
    fetchGalleryImagesFromBackend("", true); // Fetch new images for the selected source
  };

  return (
    <>
      <Box>
        {/* Image Uploader Display */}
        <Box
          sx={{
            width: 100,
            height: 100,
            border: "1px dashed #2E31BE",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              borderColor: "#1a1a8a",
            },
          }}
          onClick={handleOpenDialog}
        >
          {value ? (
            <>
              <img
                src={value}
                alt={label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  padding: 0.5,
                  cursor: "pointer",
                }}
              >
                <EditIcon fontSize="small" />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F7F9FC",
                width: "100%",
                height: "100%",
              }}
            >
              <AddIcon sx={{ color: "#2E31BE", fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" color="#5C5C5C">
                Upload
              </Typography>
            </Box>
          )}
        </Box>

       
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0px 4px 16px 0px rgba(0, 0, 0, 0.16)',
            maxHeight: '80vh'
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: '#F5F5F5',
            borderBottom: '1px solid #E0E0E0'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: '18px',
                color: '#141414'
              }}
            >
              Upload {label}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Box
              onClick={handleCloseDialog}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '250px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Box
                sx={{
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Box display="flex" gap={3}>
            {/* Left Panel - Uploader and Preview */}
            <Box flex={1}>
              {/* Upload Area */}
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: "#2E31BE",
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageUrl ? (
                  <Box>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 150,
                        objectFit: "contain",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Click to change image
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: "#666", mb: 2 }} />
                    <Typography variant="h6" mb={1}>
                      Drag and drop a {label} here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Or click to select file
                    </Typography>
                    <NovusButton variantType="secondary" component="span">
                      Select File
                    </NovusButton>
                  </Box>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={fileTypes.map(type => `.${type}`).join(",")}
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </Box>

              {/* URL Input */}
              <Box mt={2}>
                <Typography variant="subtitle2" mb={1}>
                  Or enter image URL
                </Typography>
                <NovusInput
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  novusSize="md"
                  fullWidth
                />
              </Box>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Loading Indicator */}
              {loading && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              )}

              {/* Meta Information */}
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography variant="caption" color="#5C5C5C">
                  Accepted image types: {fileTypes.join(", ")}
                </Typography>
                <Typography variant="caption" color="#5C5C5C">
                  Max image size: {formatBytes(maxSize * 1024)}
                </Typography>
                <Typography variant="caption" color="#5C5C5C">
                  Aspect ratio: {aspectRatio === "*" ? "Original" : aspectRatio}
                </Typography>
                <Typography variant="caption" color="#5C5C5C">
                  Min dimensions: {minimumResolution.width} x {minimumResolution.height} px
                </Typography>
              </Box>
            </Box>

            {/* Separator */}
            {showGallery && <Divider orientation="vertical" flexItem />}

            {/* Right Panel - Gallery */}
            {showGallery && (
              <Box flex={1}>
                {/* Image Source Dropdown */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <NovusDropdown
                    value={imageSource}
                    onChange={(e) => handleImageSourceChange(e.target.value as string)}
                    options={[
                      { value: "namespace_images", label: "My Images" },
                      { value: "brands", label: "Brands" },
                      { value: "collections", label: "Collections" },
                      { value: "products", label: "Products" },
                    ]}
                    placeholder="Select Image Source"
                    novusSize="md"
                  />
                </FormControl>

                {/* Search Input */}
                <NovusInput
                  placeholder={`Search ${imageSource !== 'namespace_images' ? imageSource + ' ' : ''}image`}
                  onChange={(e) => handleGallerySearch(e.target.value)}
                  novusSize="md"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                {/* Gallery Images */}
                {galleryError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {galleryError}
                  </Alert>
                )}

                {galleryLoading && galleryImages.length === 0 ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : galleryImages.length === 0 ? (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body2" color="text.secondary">
                      No images found
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      maxHeight: 400,
                      overflowY: "auto",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 1,
                    }}
                  >
                    {galleryImages.map((image, index) => (
                      <Card
                        key={index}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { border: "2px solid #2E31BE" },
                          height: 110,
                          position: "relative",
                        }}
                        onClick={() => setImageUrl(image.secure_url)}
                      >
                        <CardMedia
                          component="img"
                          height="70"
                          image={image.thumbnail_url || image.secure_url}
                          alt={image.text || `Gallery image ${index}`}
                          sx={{ objectFit: "contain" }}
                        />
                        <CardContent sx={{ p: 0.5, pt: 0 }}>
                          <Typography variant="caption" noWrap>
                            {image.text}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                                    {/* Load More Button */}
                    {galleryPagination.nextPage && !galleryLoading && (
                      <Box display="flex" justifyContent="center" mt={2}>
                        <NovusButton
                          variantType="secondary"
                          novusSize="sm"
                          onClick={() => fetchGalleryImagesFromBackend("", false)}
                          disabled={galleryLoading}
                        >
                          {galleryLoading ? <CircularProgress size={16} /> : "Load More"}
                        </NovusButton>
                      </Box>
                    )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'stretch',
            gap: '24px',
            padding: '16px 24px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '12px'
            }}
          >
            {value && (
              <NovusButton 
                onClick={handleDelete} 
                variantType="secondary"
                startIcon={<DeleteIcon />}
                novusSize="sm"
              >
                Delete
              </NovusButton>
            )}
            <NovusButton onClick={handleCloseDialog} variantType="secondary" novusSize="sm">
              Cancel
            </NovusButton>
            <NovusButton onClick={handleSave} variantType="primary" novusSize="sm">
              {value ? "Update" : "Add"}
            </NovusButton>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <NovusSnackbar
        open={showSnackbar}
        severity="info"
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        closable={false}
      />
    </>
  );
};

export default ImageUploader; 