import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import CodeEditor from '../commmon/CodeEditor';

interface SchemaTemplateVariablesProps {
  isEditMode?: boolean;
  schemaId?: string;
  onSave?: (data: any) => void;
  initialData?: any;
  fetchSchemaTemplate?: (id: string) => Promise<any>;
  getDefaultSEOSchema?: (pageType: string) => Promise<any>;
}

const PAGE_TYPE_LIST = [
  { text: 'Product', value: 'product' },
  { text: 'Category', value: 'category' },
  { text: 'Brand', value: 'brand' },
  { text: 'Collection', value: 'collection' },
  { text: 'Article', value: 'article' },
  { text: 'Blog', value: 'blog' },
  { text: 'Webpage', value: 'webpage' }
];

const DEFAULT_SCHEMAS = {
  product: `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{{product.name}}",
  "description": "{{product.description}}",
  "image": "{{product.image}}",
  "brand": {
    "@type": "Brand",
    "name": "{{product.brand.name}}"
  },
  "offers": {
    "@type": "Offer",
    "price": "{{product.price}}",
    "priceCurrency": "{{product.currency}}",
    "availability": "{{product.availability}}"
  }
}`,
  category: `{
  "@context": "https://schema.org/",
  "@type": "CollectionPage",
  "name": "{{category.name}}",
  "description": "{{category.description}}",
  "url": "{{category.url}}"
}`,
  brand: `{
  "@context": "https://schema.org/",
  "@type": "Brand",
  "name": "{{brand.name}}",
  "description": "{{brand.description}}",
  "logo": "{{brand.logo}}"
}`,
  collection: `{
  "@context": "https://schema.org/",
  "@type": "CollectionPage",
  "name": "{{collection.name}}",
  "description": "{{collection.description}}",
  "url": "{{collection.url}}"
}`,
  article: `{
  "@context": "https://schema.org/",
  "@type": "Article",
  "headline": "{{article.title}}",
  "description": "{{article.description}}",
  "image": "{{article.image}}",
  "author": {
    "@type": "Person",
    "name": "{{article.author}}"
  },
  "datePublished": "{{article.published_date}}"
}`,
  blog: `{
  "@context": "https://schema.org/",
  "@type": "BlogPosting",
  "headline": "{{blog.title}}",
  "description": "{{blog.description}}",
  "image": "{{blog.image}}",
  "author": {
    "@type": "Person",
    "name": "{{blog.author}}"
  },
  "datePublished": "{{blog.published_date}}"
}`,
  webpage: `{
  "@context": "https://schema.org/",
  "@type": "WebPage",
  "name": "{{page.title}}",
  "description": "{{page.description}}",
  "url": "{{page.url}}"
}`
};

const SchemaTemplateVariables = forwardRef<any, SchemaTemplateVariablesProps>(({
  isEditMode = false,
  schemaId,
  onSave,
  initialData,
  fetchSchemaTemplate,
  getDefaultSEOSchema
}, ref) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedPageType, setSelectedPageType] = useState<{ value: string; showerror: boolean; errortext: string }>({
    value: '',
    showerror: false,
    errortext: ''
  });
  const [schemaData, setSchemaData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [renderData, setRenderData] = useState('');
  const [isJsonValueError, setIsJsonValueError] = useState(false);
  const [isJsonEditorError, setIsJsonEditorError] = useState(false);



  useEffect(() => {
    if (initialData) {
      setSelectedPageType({
        value: initialData.page_type || '',
        showerror: false,
        errortext: ''
      });
      setSchemaData(initialData.schema || '');
      setJsonData(initialData.target_json || '');
      setRenderData(initialData.schema || '');
    }
  }, [initialData]);

  const handlePageTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedPageType({
      value,
      showerror: false,
      errortext: ''
    });
    if (value) {
      fetchDefaultSchema(value);
    }
  };

  const fetchDefaultSchema = async (pageType: string) => {
    if (getDefaultSEOSchema) {
      try {
        setPageLoading(true);
        const response = await getDefaultSEOSchema(pageType);
        const defaultSchema = response?.data?.items?.[0]?.schema;
        const targetJson = response?.data?.items?.[0]?.target_json;
        
        if (defaultSchema) {
          setSchemaData(defaultSchema);
          setRenderData(defaultSchema);
          if (targetJson) {
            setJsonData(JSON.stringify(targetJson, null, 2));
          }
        } else {
          // Fallback to hardcoded schemas if API doesn't return data
          if (DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS]) {
            const fallbackSchema = DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS];
            setSchemaData(fallbackSchema);
            setRenderData(fallbackSchema);
          }
        }
      } catch (error) {
        console.error('Error fetching default schema:', error);
        // Fallback to hardcoded schemas on error
        if (DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS]) {
          const fallbackSchema = DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS];
          setSchemaData(fallbackSchema);
          setRenderData(fallbackSchema);
        }
      } finally {
        setPageLoading(false);
      }
    } else {
      // Fallback to hardcoded schemas if no API function provided
      if (DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS]) {
        const defaultSchema = DEFAULT_SCHEMAS[pageType as keyof typeof DEFAULT_SCHEMAS];
        setSchemaData(defaultSchema);
        setRenderData(defaultSchema);
      }
    }
  };

  const handleSchemaEdit = (value: string) => {
    setSchemaData(value);
    setRenderData(value);
    onSave?.({
      page_type: selectedPageType.value,
      schema: value,
      target_json: jsonData
    });
  };

  const handleJsonEdit = (value: string) => {
    setJsonData(value);
    try {
      JSON.parse(value);
      setIsJsonValueError(false);
      setIsJsonEditorError(false);
    } catch (error) {
      setIsJsonValueError(true);
    }
    onSave?.({
      page_type: selectedPageType.value,
      schema: schemaData,
      target_json: value
    });
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(schemaData);
      const formatted = JSON.stringify(parsed, null, 2);
      setSchemaData(formatted);
      setRenderData(formatted);
      onSave?.({
        page_type: selectedPageType.value,
        schema: formatted,
        target_json: jsonData
      });
    } catch (error) {
      console.error('Invalid JSON format');
    }
  };

  const validate = (): boolean => {
    // Basic validation for variables component
    return !!(selectedPageType.value && schemaData && jsonData);
  };

  const getCurrentData = () => ({
    page_type: selectedPageType.value,
    schema: schemaData,
    target_json: jsonData
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    validate,
    getCurrentData
  }));

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', padding: 0, width: '100%' }}>
      <Box sx={{ 
        width: '100%', 
        padding: 3, 
        border: '1px solid #f5f5f5', 
        borderRadius: 1, 
        backgroundColor: '#fff'
      }}>
        <Typography
          sx={{
            color: '#41434C',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '27px',
            textAlign: 'left',
            mb: 2
          }}
        >
          Select Page
        </Typography>

        {/* Page Type Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth error={selectedPageType.showerror}>
            <Select
              value={selectedPageType.value}
              onChange={handlePageTypeChange}
              displayEmpty
              placeholder="Select a page"
              sx={{
                '& .MuiSelect-select': {
                  py: 1.5
                }
              }}
            >
              <MenuItem value="" disabled>
                Select a page
              </MenuItem>
              {PAGE_TYPE_LIST.map((pageType) => (
                <MenuItem key={pageType.value} value={pageType.value}>
                  {pageType.text}
                </MenuItem>
              ))}
            </Select>
            {selectedPageType.showerror && (
              <FormHelperText>{selectedPageType.errortext}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Typography
          sx={{
            color: '#41434C',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '27px',
            textAlign: 'left',
            mb: 2
          }}
        >
          Schema
        </Typography>

        {/* Schema Editor */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden'
          }}>
            <CodeEditor
              value={schemaData}
              onChange={handleSchemaEdit}
              height="300px"
              language="schema"
            />
          </Box>
        </Box>

        {/* Preview Section */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          minHeight: 0
        }}>
          {/* Example JSON */}
          <Box sx={{ 
            flex: '1 1 45%', 
            minWidth: 300,
            maxWidth: '100%'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                sx={{
                  color: '#41434C',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  lineHeight: '27px'
                }}
              >
                Example JSON
              </Typography>
              <Typography
                component="button"
                onClick={formatJson}
                sx={{
                  color: '#2C4BFF',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                Format
              </Typography>
            </Box>
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              overflow: 'hidden'
            }}>
              <CodeEditor
                value={jsonData}
                onChange={handleJsonEdit}
                height="300px"
                language="json"
              />
            </Box>
            {isJsonValueError && !isJsonEditorError && (
              <FormHelperText error sx={{ mt: 1 }}>
                Please check your payload
              </FormHelperText>
            )}
          </Box>

          {/* Preview */}
          <Box sx={{ 
            flex: '1 1 45%', 
            minWidth: 300,
            maxWidth: '100%'
          }}>
            <Typography
              sx={{
                color: '#41434C',
                fontWeight: 'bold',
                fontSize: '18px',
                lineHeight: '27px',
                mb: 1
              }}
            >
              Preview
            </Typography>
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              overflow: 'hidden'
            }}>
              <CodeEditor
                value={renderData}
                onChange={() => {}} // Read-only, so no-op function
                height="300px"
                language="json"
                readOnly={true}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default SchemaTemplateVariables; 