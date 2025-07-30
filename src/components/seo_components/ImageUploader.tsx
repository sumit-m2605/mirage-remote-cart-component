import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  FormControl,
} from "@mui/material";
import NovusSnackbar from "../Novus-MUI-wrappers/NovusSnackbar";
import {
  FileUpload as FileUploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
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
  uploadImage?: (file: File) => Promise<string>;
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
  uploadImage,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "url" | "gallery">(
    "upload"
  );
  const [imageUrl, setImageUrl] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [galleryPagination, setGalleryPagination] = useState({
    page: 0,
    nextPage: 1,
    limit: 16,
  });
  const [imageSource, setImageSource] = useState("namespace_images");

  // Load gallery images when dialog opens
  useEffect(() => {
    if (
      dialogOpen &&
      showGallery &&
      fetchGalleryImages &&
      galleryImages.length === 0
    ) {
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
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileTypes.includes(fileExtension || "")) {
      setError(`Invalid file type. Accepted types: ${fileTypes.join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024) {
      setError(
        `File size too large. Maximum size: ${formatBytes(maxSize * 1024)}`
      );
      return;
    }

    setLoading(true);
    setError("");

    // Use uploadImage function if provided, otherwise fallback to data URL
    if (uploadImage) {
      uploadImage(file)
        .then((uploadedUrl) => {
          setImageUrl(uploadedUrl);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message || "Failed to upload image");
          setLoading(false);
        });
    } else {
      // Fallback to data URL for testing
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
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
    setSnackbarMessage("Image deleted successfully");
    setShowSnackbar(true);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileTypes.includes(fileExtension || "")) {
        setError(`Invalid file type. Accepted types: ${fileTypes.join(", ")}`);
        return;
      }

      if (file.size > maxSize * 1024) {
        setError(
          `File size too large. Maximum size: ${formatBytes(maxSize * 1024)}`
        );
        return;
      }

      setLoading(true);
      setError("");

      // Use uploadImage function if provided, otherwise fallback to data URL
      if (uploadImage) {
        uploadImage(file)
          .then((uploadedUrl) => {
            setImageUrl(uploadedUrl);
            setLoading(false);
          })
          .catch((error) => {
            setError(error.message || "Failed to upload image");
            setLoading(false);
          });
      } else {
        // Fallback to data URL for testing
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImageUrl(result);
          setLoading(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Fetch gallery images from backend
  const fetchGalleryImagesFromBackend = async (
    searchText?: string,
    resetPagination = false
  ) => {
    if (!fetchGalleryImages || !namespace) {
      console.warn("fetchGalleryImages function or namespace is required");
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
        ...(searchText && { search: searchText }),
      };

      const response = await fetchGalleryImages(namespace, params);

      if (response?.data?.items) {
        const newImages = response.data.items.map((item: any) => ({
          text: item.file_name || item.name || item.text,
          secure_url: item.cdn?.url || item.secure_url || item.url,
          thumbnail_url: item.cdn?.url || item.secure_url || item.url,
          ...item,
        }));

        if (resetPagination) {
          setGalleryImages(newImages);
        } else {
          setGalleryImages((prev) => [...prev, ...newImages]);
        }

        setGalleryPagination((prev) => ({
          ...prev,
          page: resetPagination ? 1 : prev.page + 1,
          nextPage: response.data.nextPage,
        }));
      }
    } catch (err: any) {
      console.error("Failed to fetch gallery images:", err);
      setGalleryError(err.message || "Failed to load images");
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            borderRadius: "12px",
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.44622 13.8493C3.04208 13.8493 2.70001 13.7093 2.42001 13.4293C2.14 13.1493 2 12.8072 2 12.4031V10.8339C2 10.6636 2.05747 10.5211 2.1724 10.4063C2.2872 10.2913 2.42974 10.2339 2.60001 10.2339C2.77028 10.2339 2.91281 10.2913 3.02761 10.4063C3.14255 10.5211 3.20002 10.6636 3.20002 10.8339V12.4031C3.20002 12.4647 3.22568 12.5211 3.27702 12.5723C3.32822 12.6236 3.38462 12.6493 3.44622 12.6493H12.5539C12.6155 12.6493 12.6719 12.6236 12.7231 12.5723C12.7745 12.5211 12.8001 12.4647 12.8001 12.4031V10.8339C12.8001 10.6636 12.8576 10.5211 12.9725 10.4063C13.0873 10.2913 13.2299 10.2339 13.4001 10.2339C13.5704 10.2339 13.713 10.2913 13.8278 10.4063C13.9427 10.5211 14.0002 10.6636 14.0002 10.8339V12.4031C14.0002 12.8072 13.8602 13.1493 13.5802 13.4293C13.3001 13.7093 12.9581 13.8493 12.5539 13.8493H3.44622ZM7.40007 4.15998L5.86165 5.6984C5.74258 5.81734 5.60131 5.87607 5.43785 5.87461C5.27424 5.87301 5.13037 5.81014 5.00624 5.686C4.89037 5.562 4.83037 5.42153 4.82624 5.2646C4.8221 5.10766 4.8821 4.96713 5.00624 4.84299L7.49387 2.35536C7.56881 2.28042 7.64781 2.22762 7.73088 2.19696C7.81394 2.16616 7.90368 2.15076 8.00008 2.15076C8.09648 2.15076 8.18621 2.16616 8.26928 2.19696C8.35235 2.22762 8.43135 2.28042 8.50629 2.35536L10.9939 4.84299C11.1129 4.96193 11.1716 5.1012 11.1701 5.2608C11.1685 5.42027 11.1098 5.562 10.9939 5.686C10.8698 5.81014 10.7272 5.87427 10.5663 5.87841C10.4052 5.88254 10.2626 5.82254 10.1385 5.6984L8.60009 4.15998V10.2801C8.60009 10.4503 8.54262 10.5929 8.42768 10.7077C8.31288 10.8226 8.17035 10.8801 8.00008 10.8801C7.82981 10.8801 7.68727 10.8226 7.57247 10.7077C7.45754 10.5929 7.40007 10.4503 7.40007 10.2801V4.15998Z"
                  fill="#000093"
                />
              </svg>

              <Typography
                variant="caption"
                sx={{
                  color: "#000093",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "500",
                  lineHeight: "16px",
                  letterSpacing: "0",
                }}
              >
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
            borderRadius: "16px",
            boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.16)",
            maxHeight: "80vh",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: "#F5F5F5",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                color: "#141414",
              }}
            >
              Upload {label}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              onClick={handleCloseDialog}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "4px",
                width: "24px",
                height: "24px",
                borderRadius: "250px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "12px",
            padding: "16px 20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box display="flex" gap={3}>
            {/* Left Panel - Uploader and Preview */}
            <Box flex={1}>
              {/* Upload Area */}
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "12px",
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.44622 13.8493C3.04208 13.8493 2.70001 13.7093 2.42001 13.4293C2.14 13.1493 2 12.8072 2 12.4031V10.8339C2 10.6636 2.05747 10.5211 2.1724 10.4063C2.2872 10.2913 2.42974 10.2339 2.60001 10.2339C2.77028 10.2339 2.91281 10.2913 3.02761 10.4063C3.14255 10.5211 3.20002 10.6636 3.20002 10.8339V12.4031C3.20002 12.4647 3.22568 12.5211 3.27702 12.5723C3.32822 12.6236 3.38462 12.6493 3.44622 12.6493H12.5539C12.6155 12.6493 12.6719 12.6236 12.7231 12.5723C12.7745 12.5211 12.8001 12.4647 12.8001 12.4031V10.8339C12.8001 10.6636 12.8576 10.5211 12.9725 10.4063C13.0873 10.2913 13.2299 10.2339 13.4001 10.2339C13.5704 10.2339 13.713 10.2913 13.8278 10.4063C13.9427 10.5211 14.0002 10.6636 14.0002 10.8339V12.4031C14.0002 12.8072 13.8602 13.1493 13.5802 13.4293C13.3001 13.7093 12.9581 13.8493 12.5539 13.8493H3.44622ZM7.40007 4.15998L5.86165 5.6984C5.74258 5.81734 5.60131 5.87607 5.43785 5.87461C5.27424 5.87301 5.13037 5.81014 5.00624 5.686C4.89037 5.562 4.83037 5.42153 4.82624 5.2646C4.8221 5.10766 4.8821 4.96713 5.00624 4.84299L7.49387 2.35536C7.56881 2.28042 7.64781 2.22762 7.73088 2.19696C7.81394 2.16616 7.90368 2.15076 8.00008 2.15076C8.09648 2.15076 8.18621 2.16616 8.26928 2.19696C8.35235 2.22762 8.43135 2.28042 8.50629 2.35536L10.9939 4.84299C11.1129 4.96193 11.1716 5.1012 11.1701 5.2608C11.1685 5.42027 11.1098 5.562 10.9939 5.686C10.8698 5.81014 10.7272 5.87427 10.5663 5.87841C10.4052 5.88254 10.2626 5.82254 10.1385 5.6984L8.60009 4.15998V10.2801C8.60009 10.4503 8.54262 10.5929 8.42768 10.7077C8.31288 10.8226 8.17035 10.8801 8.00008 10.8801C7.82981 10.8801 7.68727 10.8226 7.57247 10.7077C7.45754 10.5929 7.40007 10.4503 7.40007 10.2801V4.15998Z"
                        fill="#000093"
                      />
                    </svg>

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
                  accept={fileTypes.map((type) => `.${type}`).join(",")}
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </Box>

              {/* URL Input - Only show when no image is present */}
              {!imageUrl && (
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
              )}

              {/* Error Display */}
              {error && (
                <NovusSnackbar
                  open={true}
                  severity="error"
                  message={error}
                  closable={true}
                  onClose={() => setError("")}
                />
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
                  Min dimensions: {minimumResolution.width} x{" "}
                  {minimumResolution.height} px
                </Typography>
              </Box>
            </Box>

            {/* Separator */}
            {showGallery && (
              <Divider
                orientation="vertical"
                sx={{
                  width: "1px",
                  height: "16px !important",
                  backgroundColor: "#E0E0E0",
                  alignSelf: "center",
                }}
              />
            )}

            {/* Right Panel - Gallery */}
            {showGallery && (
              <Box flex={1}>
                {/* Image Source Dropdown */}
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <NovusDropdown
                    value={imageSource}
                    onChange={(e) =>
                      handleImageSourceChange(e.target.value as string)
                    }
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
                  placeholder={`Search ${
                    imageSource !== "namespace_images" ? imageSource + " " : ""
                  }image`}
                  onChange={(e) => handleGallerySearch(e.target.value)}
                  novusSize="md"
                  fullWidth
                />
                {/* Gallery Images */}
                {galleryError && (
                  <NovusSnackbar
                    open={true}
                    severity="error"
                    message={galleryError}
                    closable={true}
                    onClose={() => setGalleryError("")}
                  />
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
                      {galleryLoading ? (
                        <CircularProgress size={16} />
                      ) : (
                        "Load More"
                      )}
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
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            alignSelf: "stretch",
            gap: "24px",
            padding: "16px 24px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "12px",
            }}
          >
            {value && (
              <NovusButton
                onClick={handleDelete}
                variantType="secondary"
                startIcon={<DeleteIcon />}
                novusSize="md"
              >
                Delete
              </NovusButton>
            )}
            <NovusButton
              onClick={handleSave}
              variantType="primary"
              novusSize="md"
            >
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
