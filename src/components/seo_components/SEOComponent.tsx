import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  IconButton,
  FormControl,
  Divider,
} from "@mui/material";
import { NovusInput, NovusDropdown } from "../Novus-MUI-wrappers";
import NovusButton from "../Novus-MUI-wrappers/NovusButton";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AutoAwesome as AutoAwesomeIcon,
  EditNote as EditNoteIcon,
} from "@mui/icons-material";

// Import sub-components
import MetaTagsDialog from "./MetaTagsDialog";
import MetaPreviewDialog from "./MetaPreviewDialog";
import BreadcrumbBuilder from "./BreadcrumbBuilder";
import CanonicalUrlBuilder from "./CanonicalUrlBuilder";
import ConfirmationDialog from "./ConfirmationDialog";
import ImageUploader from "./ImageUploader";

interface SEOData {
  title: string;
  description: string;
  image_url: string;
  breadcrumbs: Array<{
    url?: string;
    action?: any;
  }>;
  sitemap: {
    priority: number;
    frequency: string;
  };
  meta_tags: Array<{
    title: string;
    items: Array<{
      key: string;
      value: string;
    }>;
  }>;
  canonical_url: string;
}

interface Props {
  value: SEOData;
  url?: string;
  text?: string;
  type?: string;
  showImageUploader?: boolean;
  breadcrumbEnabled?: boolean;
  sitemapEnabled?: boolean;
  metaTagsEnabled?: boolean;
  canonicalUrlEnabled?: boolean;
  onUpdate: (data: SEOData) => void;
  generateSEO: (body: any, type: string) => Promise<any>;
  showSnackbar: (message: string, type: "success" | "error") => void;
  uploadImage?: (file: File) => Promise<string>;
  fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
  fetchBrandImages?: (params: any) => Promise<any>;
  fetchCollectionImages?: (params: any) => Promise<any>;
  fetchProductImages?: (params: any) => Promise<any>;
}

const SEOComponent: React.FC<Props> = ({
  value,
  url = "",
  text = "",
  type = "",
  showImageUploader = false,
  breadcrumbEnabled = false,
  sitemapEnabled = false,
  metaTagsEnabled = false,
  canonicalUrlEnabled = false,
  onUpdate,
  generateSEO,
  showSnackbar,
  uploadImage,
  fetchGalleryImages,
  fetchBrandImages,
  fetchCollectionImages,
  fetchProductImages,
}) => {
  // State management
  const [chipInput, setChipInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [descriptionTags, setDescriptionTags] = useState<string[]>([]);
  const [generateTitleProgress, setGenerateTitleProgress] = useState(false);
  const [generateTitleWithKeyWordProgress, setGenerateTitleWithKeyWordProgress] = useState(false);
  const [generateDescriptionProgress, setGenerateDescriptionProgress] = useState(false);
  const [generateDescriptionWithKeyWordProgress, setGenerateDescriptionWithKeyWordProgress] = useState(false);
  const [priority, setPriority] = useState(value.sitemap?.priority || 0.5);
  const [frequency, setFrequency] = useState(value.sitemap?.frequency || "never");
  const [canonicalUrlPath, setCanonicalUrlPath] = useState(value.canonical_url || "");
  const [canonicalUrlDomain, setCanonicalUrlDomain] = useState("");

  // Dialog states
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [metaTagsDialogOpen, setMetaTagsDialogOpen] = useState(false);
  const [metaPreviewDialogOpen, setMetaPreviewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number>(-1);

  // Priority and frequency options
  const priorityOptions = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const frequencyOptions = ["never", "yearly", "monthly", "weekly", "daily", "hourly", "always"];



  // Computed values
  const titlePreview = value.title && value.title.length > 80 
    ? value.title.substr(0, 79) + "…" 
    : value.title;

  const descriptionPreview = value.description && value.description.length > 400 
    ? value.description.substr(0, 399) + "…" 
    : value.description;

  const imagePreview = value.image_url;

  // Update SEO data
  const updateSEO = useCallback((data: Partial<SEOData>) => {
    onUpdate({
      title: value.title,
      description: value.description,
      image_url: value.image_url,
      breadcrumbs: value.breadcrumbs || [],
      sitemap: {
        priority,
        frequency,
      },
      meta_tags: value.meta_tags || [],
      canonical_url: value.canonical_url,
      ...data,
    });
  }, [value, priority, frequency, onUpdate]);

  // Generate SEO content
  const generate = async (type: string, key: string) => {
    let keyTags: string[] = [];
    if (type === "title") keyTags = tags;
    if (type === "description") keyTags = descriptionTags;

    if (keyTags.length === 0 && key === "keyword") {
      showSnackbar("No keywords provided", "error");
      return;
    }

    const body = {
      text,
      keywords: keyTags,
      type,
    };

    if (!body.text) {
      showSnackbar("Please provide the required text to generate SEO content", "error");
      return;
    }

    // Set progress flags
    if (type === "title") {
      if (key === "keyword") {
        setGenerateTitleWithKeyWordProgress(true);
      } else {
        setGenerateTitleProgress(true);
      }
    } else {
      if (key === "keyword") {
        setGenerateDescriptionWithKeyWordProgress(true);
      } else {
        setGenerateDescriptionProgress(true);
      }
    }

    try {
      const res = await generateSEO(body, type);
      
      if (type === "title") {
        updateSEO({ title: res.data.title || null });
        showSnackbar("Generation successful", "success");
      } else {
        updateSEO({ description: res.data.description || null });
        showSnackbar("Generation successful", "success");
      }
    } catch (err: any) {
      showSnackbar(
        (err.response && err.response.data.message) || "Failed to generate",
        "error"
      );
    } finally {
      // Reset progress flags
      if (type === "title") {
        if (key === "keyword") {
          setGenerateTitleWithKeyWordProgress(false);
        } else {
          setGenerateTitleProgress(false);
        }
      } else {
        if (key === "keyword") {
          setGenerateDescriptionWithKeyWordProgress(false);
        } else {
          setGenerateDescriptionProgress(false);
        }
      }
    }
  };

  // Cancel generation
  const cancelGenerate = (type: string, key: string) => {
    if (type === "title") {
      if (key === "keyword") {
        setGenerateTitleWithKeyWordProgress(false);
      } else {
        setGenerateTitleProgress(false);
      }
    } else {
      if (key === "keyword") {
        setGenerateDescriptionWithKeyWordProgress(false);
      } else {
        setGenerateDescriptionProgress(false);
      }
    }
  };

  // Chip management
  // Fix the addChip function to handle "keywords" type properly
  const addChip = (event: React.KeyboardEvent, type: string) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      
      let currentTags: string[];
      let setTagsFunction: React.Dispatch<React.SetStateAction<string[]>>;
      
      // Map "keywords" to "title" since they both use the same tags state
      if (type === "title" || type === "keywords") {
        currentTags = tags;
        setTagsFunction = setTags;
        if (currentTags.length > 5) return;
      } else {
        currentTags = descriptionTags;
        setTagsFunction = setDescriptionTags;
        if (currentTags.length > 7) return;
      }

      if (chipInput.trim() && !currentTags.includes(chipInput)) {
        setTagsFunction([...currentTags, chipInput]);
        setChipInput("");
      }
    }
  };

  const removeChip = (index: number, type: string) => {
    if (type === "title") {
      setTags(tags.filter((_, i) => i !== index));
    } else {
      setDescriptionTags(descriptionTags.filter((_, i) => i !== index));
    }
  };

  // Meta tags management
  const updateMetaTags = (data: any) => {
    const currentMetaTags = value.meta_tags || [];
    updateSEO({
      meta_tags: [...currentMetaTags, data],
    });
  };

  const updateMetaTag = (data: { tags: any; index: number }) => {
    const { tags, index } = data;
    const currentMetaTags = [...(value.meta_tags || [])];
    currentMetaTags[index] = tags;
    updateSEO({
      meta_tags: currentMetaTags,
    });
  };

  const deleteMetaTag = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const currentMetaTags = [...(value.meta_tags || [])];
    currentMetaTags.splice(deleteIndex, 1);
    updateSEO({ meta_tags: currentMetaTags });
    setDeleteDialogOpen(false);
    setDeleteIndex(-1);
    showSnackbar("Meta tag deleted successfully", "success");
  };

  const getTagInString = (arr: Array<{ key: string; value: string }> = []) => {
    const str = arr.map(item => `${item.key}="${item.value}"`).join(" ");
    return `<meta ${str}></meta>`;
  };

  // Breadcrumb management
  const updateBreadcrumb = (breadcrumbs: any[]) => {
    updateSEO({ breadcrumbs });
  };

  const deleteBreadcrumb = (index: number) => {
    const currentBreadcrumbs = [...(value.breadcrumbs || [])];
    currentBreadcrumbs.splice(index, 1);
    updateSEO({ breadcrumbs: currentBreadcrumbs });
  };

  const addBreadcrumbLevel = () => {
    const currentBreadcrumbs = [...(value.breadcrumbs || [])];
    updateSEO({ breadcrumbs: [...currentBreadcrumbs, {}] });
  };

  // Handle input changes
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSEO({ title: event.target.value });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSEO({ description: event.target.value });
  };

  const handleImageChange = (imageUrl: string) => {
    updateSEO({ image_url: imageUrl });
  };

  const handlePriorityChange = (event: any) => {
    const newPriority = event.target.value;
    setPriority(newPriority);
    updateSEO({ sitemap: { priority: newPriority, frequency } });
  };

  const handleFrequencyChange = (event: any) => {
    const newFrequency = event.target.value;
    setFrequency(newFrequency);
    updateSEO({ sitemap: { priority, frequency: newFrequency } });
  };

  const handleCanonicalUrlChange = (data: { canonical_url: string }) => {
    updateSEO({ canonical_url: data.canonical_url });
  };

  // Wrapper function to handle different image sources
  const handleFetchGalleryImages = async (namespace: string, params: any) => {
    const { source, ...otherParams } = params;
    
    switch (source) {
      case 'namespace_images':
        return fetchGalleryImages ? await fetchGalleryImages(namespace, otherParams) : null;
      case 'brands':
        return fetchBrandImages ? await fetchBrandImages(otherParams) : null;
      case 'collections':
        return fetchCollectionImages ? await fetchCollectionImages(otherParams) : null;
      case 'products':
        return fetchProductImages ? await fetchProductImages(otherParams) : null;
      default:
        return fetchGalleryImages ? await fetchGalleryImages(namespace, otherParams) : null;
    }
  };

  return (
    <Box className="seo-container" display="flex" flexDirection="column" gap={3}>
      {/* SEO Section */}
      <Box
        bgcolor={'#FFFFFF'}
        borderRadius={'12px'}
        border={'1px solid #FAFAFA'}
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          padding={'16px 24px'}
          borderBottom={'1px solid #E0E0E0'}
        >
          <Typography variant="h6" fontWeight={500} fontSize="16px" color="#141414">
            SEO
          </Typography>
        </Box>

        {/* Content */}
        <Box padding={'24px'} display="flex" flexDirection="column" gap={3}>
        {/* Title Input */}
        <Box>
          <NovusInput
            label="Title"
            value={value.title}
            onChange={handleTitleChange}
            placeholder="Add title here"
            disabled={generateTitleProgress || generateTitleWithKeyWordProgress}
            maxLength={400}
            helperText={
              value.title && value.title.length > 0
                ? value.title.length > 44 && value.title.length < 61
                  ? "Recommended: Keep SEO title between 45-60 characters"
                  : "Recommended: Keep SEO title between 45-60 characters"
                : ""
            }
            novusSize="md"
            showCharacterCount
          />
          
          <Box display="flex" gap={1} mt={1}>
            <NovusButton
              variantType="tertiary"
              novusSize="xs"
              loading={generateTitleProgress}
              onClick={() => generateTitleProgress ? cancelGenerate("title", "") : generate("title", "")}
            >
              <AutoAwesomeIcon style={{ marginRight: '8px', fontSize: '16px' }} />
              {generateTitleProgress ? 'Cancel' : 'Generate'}
            </NovusButton>
            
            <Divider orientation="vertical" flexItem />
            
            <NovusButton
              variantType="tertiary"
              novusSize="xs"
              loading={generateTitleWithKeyWordProgress}
              onClick={() => generateTitleWithKeyWordProgress ? cancelGenerate("title", "keyword") : setTitleDialogOpen(true)}
            >
              <EditNoteIcon style={{ marginRight: '8px', fontSize: '16px' }} />
              {generateTitleWithKeyWordProgress ? 'Cancel' : 'Generate Using Custom Keyword'}
            </NovusButton>
          </Box>
        </Box>

        {/* Description Input */}
        <Box>
          <NovusInput
            label="Description"
            value={value.description}
            onChange={handleDescriptionChange}
            placeholder="Enter description here"
            multiline
            rows={4}
            disabled={generateDescriptionProgress || generateDescriptionWithKeyWordProgress}
            maxLength={600}
            helperText={
              value.description && value.description.length > 0
                ? value.description.length <= 160
                  ? "Recommended: Keep SEO description under 160 characters for best results on search engines"
                  : "Recommended limit exceeded - this may impact your SEO"
                : ""
            }
            novusSize="md"
            showCharacterCount
          />
          
          <Box display="flex" gap={1} mt={1}>
            <NovusButton
              variantType="tertiary"
              novusSize="xs"
              loading={generateDescriptionProgress}
              onClick={() => generateDescriptionProgress ? cancelGenerate("description", "") : generate("description", "")}
            >
              <AutoAwesomeIcon style={{ marginRight: '8px', fontSize: '16px' }} />
              {generateDescriptionProgress ? 'Cancel' : 'Generate'}
            </NovusButton>
            
            <Divider orientation="vertical" flexItem />
            
            <NovusButton
              variantType="tertiary"
              novusSize="xs"
              loading={generateDescriptionWithKeyWordProgress}
              onClick={() => generateDescriptionWithKeyWordProgress ? cancelGenerate("description", "keyword") : setDescriptionDialogOpen(true)}
            >
              <EditNoteIcon style={{ marginRight: '8px', fontSize: '16px' }} />
              {generateDescriptionWithKeyWordProgress ? 'Cancel' : 'Generate Using Custom Keyword'}
            </NovusButton>
          </Box>
        </Box>

        {/* Social Media Image Uploader */}
        {showImageUploader && (
          <Box>
            <Typography variant="subtitle2" color="#9b9b9b" mb={1}>
              Social Media Image
            </Typography>
            <ImageUploader
              value={value.image_url}
              onChange={handleImageChange}
              onDelete={() => handleImageChange("")}
              label="social media image"
              aspectRatio="*"
              minimumResolution={{
                width: 200,
                height: 200
              }}
              maximumResolution={{
                width: 2400,
                height: 1200
              }}
              maxSize={2048}
              fileTypes={["png", "jpeg", "webp", "bmp"]}
              namespace="misc"
              fileName="Social Media"
              showGallery={true}
              fetchGalleryImages={handleFetchGalleryImages}
            />
          </Box>
        )}
        </Box>
      </Box>

      {/* Preview Section */}
      {(titlePreview || descriptionPreview) && (
        <Box
          bgcolor={'#FFFFFF'}
          borderRadius={'12px'}
          border={'1px solid #FAFAFA'}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            padding={'16px 24px'}
            borderBottom={'1px solid #E0E0E0'}
          >
            <Typography variant="h6" fontWeight={500} fontSize="16px" color="#141414">
              Preview
            </Typography>
          </Box>

          {/* Content */}
          <Box padding={'16px'} border={'1px solid #E0E0E0'} borderRadius={'12px'} margin={'24px'}>
            <Box fontFamily="arial, sans-serif">
              <Typography
                variant="h6"
                color="#1a0dab"
                sx={{ fontSize: 18, fontWeight: 400, lineHeight: 1.44, margin: 0 }}
              >
                {titlePreview || "Title"}
              </Typography>
              <Typography
                variant="body2"
                color="#006621"
                sx={{ fontSize: 14, lineHeight: 1.3, margin: 0 }}
              >
                {url || "https://"}
              </Typography>
              <Typography
                variant="body2"
                color="#545454"
                sx={{ fontSize: 14, lineHeight: 1.58, marginTop: 0.5 }}
              >
                {descriptionPreview || "Brief description about the preview"}
              </Typography>
              {showImageUploader && imagePreview && (
                <Box mt={1}>
                  <img
                    src={imagePreview}
                    alt={titlePreview}
                    style={{ height: 80, width: "auto" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Canonical URL Builder */}
      {canonicalUrlEnabled && (
        <CanonicalUrlBuilder
          canonicalUrlPath={value.canonical_url}
          canonicalUrlDomain={canonicalUrlDomain}
          onUpdateCanonicalUrlPath={handleCanonicalUrlChange}
        />
      )}

      {/* Breadcrumbs Section */}
      {breadcrumbEnabled && (
        <Box
          bgcolor={'#FFFFFF'}
          borderRadius={'12px'}
          border={'1px solid #FAFAFA'}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            padding={'16px 24px'}
            borderBottom={'1px solid #E0E0E0'}
          >
            <Typography variant="h6" fontWeight={500} fontSize="16px" color="#141414">
              Breadcrumbs
            </Typography>
          </Box>

          {/* Content */}
          <Box padding={'24px'} display="flex" flexDirection="column" gap={2}>
            {(value.breadcrumbs || []).map((breadcrumb, index) => (
              <BreadcrumbBuilder
                key={index}
                breadcrumb={breadcrumb}
                existingBreadcrumbs={value.breadcrumbs || []}
                onUpdateBreadcrumb={updateBreadcrumb}
                onDeleteBreadcrumb={() => deleteBreadcrumb(index)}
              />
            ))}
            <NovusButton
              variantType="secondary"
              onClick={addBreadcrumbLevel}
              startIcon={<AddIcon />}
              novusSize="sm"
            >
              Add Level
            </NovusButton>
          </Box>
        </Box>
      )}

      {/* Sitemap Section */}
      {sitemapEnabled && (
        <Box
          bgcolor={'#FFFFFF'}
          borderRadius={'12px'}
          border={'1px solid #FAFAFA'}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            padding={'16px 24px'}
            borderBottom={'1px solid #E0E0E0'}
          >
            <Typography variant="h6" fontWeight={500} fontSize="16px" color="#141414">
              Sitemap
            </Typography>
          </Box>

          {/* Content */}
          <Box padding={'24px'} display="flex" flexDirection="row" gap={3}>
            <FormControl sx={{ minWidth: 200 }}>
              <NovusDropdown
                label="Priority"
                value={priority}
                onChange={handlePriorityChange}
                options={priorityOptions.map(option => ({ value: option, label: option.toString() }))}
                placeholder="Select priority"
                novusSize="md"
              />
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <NovusDropdown
                label="Frequency"
                value={frequency}
                onChange={handleFrequencyChange}
                options={frequencyOptions.map(option => ({ value: option, label: option }))}
                placeholder="Select frequency"
                novusSize="md"
              />
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Meta Tags Section */}
      {metaTagsEnabled && (
        <Box
          bgcolor={'#FFFFFF'}
          borderRadius={'12px'}
          border={'1px solid #FAFAFA'}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding={'16px 24px'}
            borderBottom={'1px solid #E0E0E0'}
          >
            <Typography variant="h6" fontWeight={500} fontSize="16px" color="#141414">
              Meta Tags
            </Typography>
            <Box display="flex" gap={1}>
              <NovusButton
                variantType="secondary"
                onClick={() => setMetaPreviewDialogOpen(true)}
                startIcon={<VisibilityIcon />}
                novusSize="sm"
              >
                Preview
              </NovusButton>
              <NovusButton
                onClick={() => setMetaTagsDialogOpen(true)}
                startIcon={<AddIcon />}
                novusSize="sm"
              >
                Add SEO Meta Tags
              </NovusButton>
            </Box>
          </Box>

          {/* Content */}
          <Box padding={'24px'} display="flex" flexDirection="column" gap={2}>
            {(value.meta_tags || []).map((metaTag, index) => (
              <Box
                key={index}
                p={2}
                border={1}
                borderColor="#E0E0E0"
                borderRadius={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#FAFAFA"
              >
                <Box>
                  <Typography variant="subtitle1" mb={1} fontWeight={500} fontSize="16px" color="#141414">
                    {metaTag.title}
                  </Typography>
                  <Typography variant="body2" color="#9b9b9b" fontSize="11px">
                    {getTagInString(metaTag.items)}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => setMetaTagsDialogOpen(true)}
                    title="Edit Meta Tag"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteMetaTag(index)}
                    title="Delete Meta Tag"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Dialogs */}
      
      {/* Title Keywords Dialog */}
      <Dialog 
        open={titleDialogOpen} 
        onClose={() => setTitleDialogOpen(false)} 
        maxWidth="sm" 
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
              Custom Keywords
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
              onClick={() => setTitleDialogOpen(false)}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'stretch',
              gap: '24px'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              You can enter up to 6 custom keywords to help the system generate best description for you
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">Keywords</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tags.length}/6 Keywords
                </Typography>
              </Box>
              <Box
                border={1}
                borderColor="#E0E0E0"
                borderRadius={1}
                p={1}
                minHeight={120}
                display="flex"
                flexDirection="column-reverse"
                
                gap={1}
              >
                {/* Chips container - fixed at top */}
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  minHeight={0}
                  flex={1}
                >
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeChip(index, "title")}
                      size="small"
                    />
                  ))}
                </Box>
                
                {/* Input container - fixed at bottom */}
                <Box>
                  <NovusInput
                    placeholder="Type a keyword and press enter"
                    value={chipInput}
                    onChange={(e) => setChipInput(e.target.value)}
                    onKeyDown={(e) => addChip(e, "title")}
                    novusSize="sm"
                  />
                </Box>
              </Box>
            </Box>
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
            <NovusButton variantType="secondary" novusSize="sm" onClick={() => setTitleDialogOpen(false)}>
              Cancel
            </NovusButton>
            <NovusButton
              variantType="primary"
              novusSize="sm"
              onClick={() => {
                generate("title", "keyword");
                setTitleDialogOpen(false);
              }}
            >
              Generate
            </NovusButton>
          </Box>
        </Box>
      </Dialog>

      {/* Description Keywords Dialog */}
      <Dialog 
        open={descriptionDialogOpen} 
        onClose={() => setDescriptionDialogOpen(false)} 
        maxWidth="sm" 
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
              Custom Keywords
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
              onClick={() => setDescriptionDialogOpen(false)}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'stretch',
              gap: '24px'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              You can enter up to 8 custom keywords to help the system generate best description for you
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">Keywords</Typography>
                <Typography variant="body2" color="text.secondary">
                  {descriptionTags.length}/8 Keywords
                </Typography>
              </Box>
              <Box
                border={1}
                borderColor="#E0E0E0"
                borderRadius={1}
                p={1}
                minHeight={120}
                display="flex"
                flexDirection="column"
                gap={1}
              >
                {/* Chips container - fixed at top */}
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  minHeight={0}
                  flex={1}
                >
                  {descriptionTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeChip(index, "description")}
                      size="small"
                    />
                  ))}
                </Box>
                
                {/* Input container - fixed at bottom */}
                <Box>
                  <NovusInput
                    placeholder="Type a keyword and press enter"
                    value={chipInput}
                    onChange={(e) => setChipInput(e.target.value)}
                    onKeyDown={(e) => addChip(e, "description")}
                    novusSize="sm"
                  />
                </Box>
              </Box>
            </Box>
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
            <NovusButton variantType="secondary" novusSize="sm" onClick={() => setDescriptionDialogOpen(false)}>
              Cancel
            </NovusButton>
            <NovusButton
              variantType="primary"
              novusSize="sm"
              onClick={() => {
                generate("description", "keyword");
                setDescriptionDialogOpen(false);
              }}
            >
              Generate
            </NovusButton>
          </Box>
        </Box>
      </Dialog>

      {/* Meta Tags Dialog */}
      <MetaTagsDialog
        open={metaTagsDialogOpen}
        onClose={() => setMetaTagsDialogOpen(false)}
        onSave={updateMetaTags}
        onUpdate={updateMetaTag}
        metaTags={value.meta_tags || []}
      />

      {/* Meta Preview Dialog */}
      <MetaPreviewDialog
        open={metaPreviewDialogOpen}
        onClose={() => setMetaPreviewDialogOpen(false)}
        metaTags={value.meta_tags || []}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Are you sure you want to delete this meta tag?"
        message="Once you take this action, it cannot be undone"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default SEOComponent; 