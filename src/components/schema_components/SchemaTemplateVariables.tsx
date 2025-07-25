import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  FormHelperText
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { NovusDropdown } from '../Novus-MUI-wrappers';
import CodeEditor from '../commmon/CodeEditor';

// Base64 decoding function
const base64Decode = (encodedData: string): string => {
  if (!encodedData || typeof encodedData !== 'string') {
    return '';
  }
  
  try {
    // Check if the data looks like base64 (contains only base64 characters)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(encodedData)) {
      console.log('Data does not appear to be base64 encoded, returning as-is');
      return encodedData;
    }
    
    const binaryString = atob(encodedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoded = new TextDecoder().decode(bytes);
    console.log('Successfully decoded base64 data');
    return decoded;
  } catch (error) {
    console.error('Error decoding base64:', error);
    console.log('Returning original data as fallback');
    return encodedData; // Return original if decoding fails
  }
};

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

// Helper function to normalize page type values
const normalizePageType = (pageType: string): string => {
  if (!pageType) return '';
  
  // Common variations that might be stored in the database
  const variations: Record<string, string> = {
    'Product': 'product',
    'product': 'product',
    'PRODUCT': 'product',
    'Category': 'category',
    'category': 'category',
    'CATEGORY': 'category',
    'Brand': 'brand',
    'brand': 'brand',
    'BRAND': 'brand',
    'Collection': 'collection',
    'collection': 'collection',
    'COLLECTION': 'collection',
    'Article': 'article',
    'article': 'article',
    'ARTICLE': 'article',
    'Blog': 'blog',
    'blog': 'blog',
    'BLOG': 'blog',
    'Webpage': 'webpage',
    'webpage': 'webpage',
    'WEBPAGE': 'webpage',
    'WebPage': 'webpage',
    'web_page': 'webpage',
    'web-page': 'webpage'
  };
  
  return variations[pageType] || pageType.toLowerCase();
};

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
      console.log('SchemaTemplateVariables - initialData received:', initialData);
      console.log('SchemaTemplateVariables - initialData.schema type:', typeof initialData.schema);
      console.log('SchemaTemplateVariables - initialData.schema value:', initialData.schema);
      console.log('SchemaTemplateVariables - initialData.page_type:', initialData.page_type);
      console.log('SchemaTemplateVariables - initialData.target_json:', initialData.target_json);
      
      const rawPageTypeValue = initialData.page_type || '';
      console.log('SchemaTemplateVariables - raw page_type value:', rawPageTypeValue);
      
      // Normalize the page type value
      const normalizedPageType = normalizePageType(rawPageTypeValue);
      console.log('SchemaTemplateVariables - normalized page_type value:', normalizedPageType);
      
      // Check if the normalized page_type value exists in PAGE_TYPE_LIST
      const validPageType = PAGE_TYPE_LIST.find(option => option.value === normalizedPageType);
      console.log('SchemaTemplateVariables - valid page type found:', validPageType);
      
      setSelectedPageType({
        value: normalizedPageType,
        showerror: false,
        errortext: ''
      });
      
      // Decode schema data if it's base64 encoded
      let decodedSchema = '';
      if (initialData.schema) {
        // Check if it's already valid JSON (not base64 encoded)
        try {
          JSON.parse(initialData.schema);
          console.log('Schema appears to be already in JSON format');
          decodedSchema = initialData.schema;
        } catch {
          // Not valid JSON, try base64 decoding
          console.log('Schema is not valid JSON, attempting base64 decode');
          decodedSchema = base64Decode(initialData.schema);
        }
      }
      console.log('SchemaTemplateVariables - final schema:', decodedSchema);
      setSchemaData(decodedSchema);
      setRenderData(decodedSchema);
      
      // Handle target_json - it might be a string or object
      let jsonDataToSet = '';
      if (initialData.target_json) {
        if (typeof initialData.target_json === 'string') {
          jsonDataToSet = initialData.target_json;
        } else {
          jsonDataToSet = JSON.stringify(initialData.target_json, null, 2);
        }
      }
      setJsonData(jsonDataToSet);
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

  console.log('SchemaTemplateVariables - rendering with selectedPageType:', selectedPageType);
  console.log('SchemaTemplateVariables - PAGE_TYPE_LIST:', PAGE_TYPE_LIST);
  console.log('SchemaTemplateVariables - dropdown options:', PAGE_TYPE_LIST.map(pageType => ({
    value: pageType.value,
    label: pageType.text
  })));
  
  // Check if the selected page type exists in the options
  const matchingOption = PAGE_TYPE_LIST.find(option => option.value === selectedPageType.value);
  console.log('SchemaTemplateVariables - matching option:', matchingOption);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ 
        width: '100%', 
        padding: 4, 
        border: '1px solid #e0e0e0', 
        borderRadius: 2, 
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box'
      }}>
        <Typography
          sx={{
            color: '#41434C',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '27px',
            textAlign: 'left',
            mb: 3
          }}
        >
          Select Page
        </Typography>

        {/* Page Type Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth error={selectedPageType.showerror}>
            <NovusDropdown
              value={selectedPageType.value}
              onChange={(event: any) => handlePageTypeChange(event)}
              placeholder="Select a page"
              options={PAGE_TYPE_LIST.map(pageType => ({
                value: pageType.value,
                label: pageType.text
              }))}
              novusSize="m"
            />
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
            mb: 3
          }}
        >
          Schema
        </Typography>

        {/* Schema Editor */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            width: '100%'
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
          gap: { xs: 2, md: 3 }, 
          flexWrap: 'wrap',
          minHeight: 0,
          width: '100%'
        }}>
          {/* Example JSON */}
          <Box sx={{ 
            flex: '1 1 48%', 
            minWidth: { xs: '100%', md: 350 },
            maxWidth: '100%',
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              width: '100%'
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
            flex: '1 1 48%', 
            minWidth: { xs: '100%', md: 350 },
            maxWidth: '100%',
            width: '100%'
          }}>
            <Typography
              sx={{
                color: '#41434C',
                fontWeight: 'bold',
                fontSize: '18px',
                lineHeight: '27px',
                mb: 2
              }}
            >
              Preview
            </Typography>
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              width: '100%'
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