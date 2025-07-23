import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import SchemaTemplateCard from './SchemaTemplateCard';

interface SchemaTemplate {
  _id: string;
  title: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  limit: number;
  current: number;
  total: number;
}

interface SchemaTemplateListingProps {
  onEditTemplate: (template: SchemaTemplate) => void;
  fetchSchemaTemplates?: (params: any) => Promise<any>;
}

const PAGE_FILTERS = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' }
];

const SchemaTemplateListing: React.FC<SchemaTemplateListingProps> = ({
  onEditTemplate,
  fetchSchemaTemplates
}) => {
  const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationData>({
    limit: 10,
    current: 1,
    total: 0
  });

  // Debounce search function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const fetchTemplates = async () => {
    if (!fetchSchemaTemplates) {
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        page_size: pagination.limit,
        page_no: pagination.current
      };

      if (selectedFilter !== 'all') {
        params.active = selectedFilter === 'active' ? 'true' : 'false';
      }

      if (searchText) {
        params.title = searchText;
      }

      const response = await fetchSchemaTemplates({ params });
      
      // The Vue wrapper transforms the response to { data: { items: [], page: {} } }
      const responseData = response.data || response;
      
      setTemplates(responseData.items || []);
      setPagination(prev => ({
        ...prev,
        total: responseData.page?.item_total || 0,
        current: responseData.page?.current || 1,
        limit: responseData.page?.size || 10
      }));
      setError(false);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [pagination.current, pagination.limit, selectedFilter]);

  // Initial load
  useEffect(() => {
    if (fetchSchemaTemplates) {
      fetchTemplates();
    }
  }, [fetchSchemaTemplates]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setSelectedFilter(event.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const debouncedSearch = debounce(() => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchTemplates();
  }, 500);

  useEffect(() => {
    debouncedSearch();
  }, [searchText]);

  const handleEditTemplate = (template: SchemaTemplate) => {
    onEditTemplate(template);
  };

  if (loading && templates.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error" onClose={() => fetchTemplates()}>
          Failed to load schema templates. Click to retry.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2.5 }}>
      {/* Search and Filter Section */}
      {(loading || searchText !== '' || selectedFilter !== 'all' || templates.length > 0) && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mb: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              padding: 1.5,
              alignItems: 'flex-start',
              gap: 1.25,
              borderRadius: 1,
              backgroundColor: '#f5f5f5'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                height: 40,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 1.25,
                flex: 1,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                px: 1.5
              }}
            >
              <TextField
                fullWidth
                placeholder="Search here"
                value={searchText}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  sx: { border: 'none', '& fieldset': { border: 'none' } }
                }}
                sx={{ '& .MuiInputBase-root': { border: 'none' } }}
              />
            </Box>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={selectedFilter}
                onChange={handleFilterChange}
                displayEmpty
                sx={{
                  height: 40,
                  '& .MuiSelect-select': { py: 1 }
                }}
              >
                {PAGE_FILTERS.map((filter) => (
                  <MenuItem key={filter.value} value={filter.value}>
                    {filter.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Templates List */}
      {templates.length > 0 ? (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 2 }}>
          {templates.map((template) => (
            <Box component="li" key={template._id} sx={{ mb: 1 }}>
              <SchemaTemplateCard
                template={template}
                onEdit={handleEditTemplate}
              />
            </Box>
          ))}
        </Box>
      ) : !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No results found
          </Typography>
        </Box>
      ) : null}

      {/* Pagination */}
      {pagination.total > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.current}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default SchemaTemplateListing; 