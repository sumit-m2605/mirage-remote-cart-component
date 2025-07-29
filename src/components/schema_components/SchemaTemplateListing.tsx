import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Typography,
  Alert,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { NovusInput, NovusDropdown } from "../Novus-MUI-wrappers";
import SchemaTemplateCard from "./SchemaTemplateCard";
import ShimmerLoader from "../commmon/ShimmerLoader";

interface SchemaTemplate {
  _id: string;
  title: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  schema?: string;
  page_type?: string;
  target_json?: string | object;
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
  { text: "All", value: "all" },
  { text: "Active", value: "active" },
  { text: "Inactive", value: "inactive" },
];

const SchemaTemplateListing: React.FC<SchemaTemplateListingProps> = ({
  onEditTemplate,
  fetchSchemaTemplates,
}) => {
  const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [pagination, setPagination] = useState<PaginationData>({
    limit: 10,
    current: 1,
    total: 0,
  });

  // Debounce search function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const fetchTemplates = useCallback(
    async (pageOverride?: number) => {
      if (!fetchSchemaTemplates) {
        return;
      }

      setLoading(true);
      try {
        const currentPage = pageOverride || pagination.current;

        const params: any = {
          page_size: pagination.limit,
          page_no: currentPage,
        };

        if (selectedFilter !== "all") {
          params.active = selectedFilter === "active" ? "true" : "false";
        }

        if (searchText) {
          params.title = searchText;
        }

        const response = await fetchSchemaTemplates(params);

        // Handle the response structure from Vuex store
        const responseData = response.data || response;

        setTemplates(responseData.items || []);
        setPagination((prev) => ({
          ...prev,
          total: responseData.page?.item_total || 0,
          current: responseData.page?.current || currentPage,
          limit: responseData.page?.size || 10,
        }));
        setError(false);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError(true);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    },
    [
      fetchSchemaTemplates,
      pagination.limit,
      selectedFilter,
      searchText,
      pagination.current,
    ]
  );

  // Initial load
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle search changes with debouncing
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleFilterChange = (event: any) => {
    setSelectedFilter(event.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    // Prevent unnecessary re-renders by checking if page actually changed
    if (page !== pagination.current) {
      setPagination((prev) => ({ ...prev, current: page }));
      // Fetch templates for the new page immediately
      fetchTemplates(page);
    }
  };

  // Debounced search effect - use ref to prevent recreation
  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null);
  const prevSearchRef = useRef({ searchText, selectedFilter });
  
  // Effect for search and filter changes
  useEffect(() => {
    // Only trigger search if search text or filter actually changed
    const hasSearchChanged = 
      prevSearchRef.current.searchText !== searchText || 
      prevSearchRef.current.selectedFilter !== selectedFilter;
    
    if (hasSearchChanged) {
      // Clear previous timeout
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current);
      }
      
      // Set new timeout
      debouncedSearchRef.current = setTimeout(() => {
        // Only reset to page 1 for search/filter changes, not for pagination
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchTemplates(1);
      }, 500);
    }
    
    // Update previous values
    prevSearchRef.current = { searchText, selectedFilter };
    
    return () => {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current);
      }
    };
  }, [searchText, selectedFilter, fetchTemplates]);

  const handleEditTemplate = (template: SchemaTemplate) => {
    onEditTemplate(template);
  };

  if (loading && templates.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <ShimmerLoader height="200px" />
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
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Search and Filter Section */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "24px",
          boxSizing: "border-box",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <NovusInput
          placeholder="Search here"
          value={searchText}
          onChange={handleSearchChange}
          novusSize="md"
          fullWidth
        />
        <FormControl
          sx={{
            minWidth: 120,
            flexShrink: 0,
          }}
        >
          <NovusDropdown
            value={selectedFilter}
            onChange={handleFilterChange}
            options={PAGE_FILTERS.map((filter) => ({
              value: filter.value,
              label: filter.text,
            }))}
            placeholder="Filter"
            novusSize="md"
          />
        </FormControl>
      </Box>

      {/* Templates List - Scrollable */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          padding: "0 24px 0 24px",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        {templates.length > 0 ? (
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            {templates.map((template) => (
              <Box
                component="li"
                key={template._id}
              >
                <SchemaTemplateCard
                  template={template}
                  onEdit={handleEditTemplate}
                />
              </Box>
            ))}
          </Box>
        ) : !loading ? (
          <Box
            p={4}
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <img
              src="/public/admin/assets/admin/svgs/no_search_result_found.svg"
              alt="No Results"
            />
            No results found
          </Box>
        ) : null}
      </Box>

              {/* Pagination - Fixed at bottom */}
        {pagination.total > 0 && (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            padding: "24px",
            flexShrink: 0,
          }}>
            <Pagination
              count={Math.ceil(pagination.total / pagination.limit)}
              page={pagination.current}
              onChange={handlePageChange}
              showFirstButton
              showLastButton
              disabled={loading}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#666666',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#2C4BFF',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#2C4BFF',
                    },
                  },
                  '&.Mui-disabled': {
                    color: '#CCCCCC',
                  },
                },
                '& .MuiPaginationItem-icon': {
                  color: '#666666',
                },
              }}
            />
          </Box>
        )}
    </Box>
  );
};

export default SchemaTemplateListing;
