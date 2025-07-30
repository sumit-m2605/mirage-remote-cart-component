import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  FormControl,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { NovusInput, NovusDropdown } from "../Novus-MUI-wrappers";
import SchemaTemplateCard from "./SchemaTemplateCard";
import ShimmerLoader from "../commmon/ShimmerLoader";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
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

// Color definitions
const COLORS = {
  PAGINATION: {
    DEFAULT: '#666666',
    HOVER_BG: '#F5F5F5',
    SELECTED_BG: '#2C4BFF',
    SELECTED_TEXT: '#FFFFFF',
    DISABLED: '#CCCCCC',
  },
};

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
          startIcon={<SearchIcon />}
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
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "24px",
            flexShrink: 0,
          }}>
            {/* Left side - Showing results info */}
            <Box sx={{ color: COLORS.PAGINATION.DEFAULT, fontSize: "14px" }}>
              Showing {((pagination.current - 1) * pagination.limit) + 1}-{Math.min(pagination.current * pagination.limit, pagination.total)} of {pagination.total} results
            </Box>

            {/* Right side - Rows per page and navigation */}
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "16px" 
            }}>
              {/* Rows per page dropdown */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Box sx={{ color: COLORS.PAGINATION.DEFAULT, fontSize: "14px" }}>
                  Rows per page
                </Box>
                <FormControl size="small" sx={{ minWidth: "80px" }}>
                  <Select
                    value={pagination.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setPagination(prev => ({ ...prev, limit: newLimit, current: 1 }));
                      // Fetch templates with the new limit immediately
                      if (fetchSchemaTemplates) {
                        setLoading(true);
                        const params: any = {
                          page_size: newLimit,
                          page_no: 1,
                        };
                        if (selectedFilter !== "all") {
                          params.active = selectedFilter === "active" ? "true" : "false";
                        }
                        if (searchText) {
                          params.title = searchText;
                        }
                        fetchSchemaTemplates(params)
                          .then((response) => {
                            const responseData = response.data || response;
                            setTemplates(responseData.items || []);
                            setPagination((prev) => ({
                              ...prev,
                              total: responseData.page?.item_total || 0,
                              current: responseData.page?.current || 1,
                              limit: responseData.page?.size || newLimit,
                            }));
                            setError(false);
                          })
                          .catch((err) => {
                            console.error("Error fetching templates:", err);
                            setError(true);
                            setTemplates([]);
                          })
                          .finally(() => {
                            setLoading(false);
                          });
                      }
                    }}
                    sx={{
                      fontSize: "14px",
                      // color: COLORS.PAGINATION.DEFAULT,
                      // '& .MuiOutlinedInput-notchedOutline': {
                      //   borderColor: COLORS.PAGINATION.DEFAULT,
                      // },
                      // '&:hover .MuiOutlinedInput-notchedOutline': {
                      //   borderColor: COLORS.PAGINATION.DEFAULT,
                      // },
                      // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      //   borderColor: COLORS.PAGINATION.SELECTED_BG,
                      // },
                    }}
                    MenuProps={{
                      disableScrollLock: true,
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      PaperProps: {
                        sx: {
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #FFFFFF',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 16px 0px #00000029',
                          padding: '4px',
                          maxHeight: '250px',
                          height: 'fit-content',
                          width: 'fit-content',
                          minWidth: '100%',
                          overflow: 'auto',
                          margin: '4px 0px',
                          '& .MuiList-root': {
                            paddingTop: '0 !important',
                            paddingBottom: '0 !important',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          },
                          '& .MuiMenuItem-root': {
                            fontFamily: '"Inter", sans-serif !important',
                            fontSize: '12px !important',
                            lineHeight: '1.5em !important',
                            fontWeight: 400,
                            color: '#141414',
                            borderRadius: '4px',
                            minHeight: '28px !important',
                            width: '100% !important',
                            minWidth: '100% !important',
                            '& .MuiTypography-root': {
                              fontSize: '14px !important',
                              lineHeight: '1.5em !important',
                            },
                            '&:hover': {
                              backgroundColor: '#F5F5F5',
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#F0F0FF',
                              color: '#000093',
                              '&:hover': {
                                backgroundColor: '#E8E8FC',
                              },
                            },
                            '&.Mui-disabled': {
                              color: '#A0AEC0',
                            },
                          },
                          // Scrollbar styling
                          '&::-webkit-scrollbar': {
                            width: '8px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#D4D4D4',
                            borderRadius: '250px',
                            width: '4px',
                            height: '280px',
                          },
                          '&::-webkit-scrollbar-thumb:hover': {
                            background: '#B8B8B8',
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Navigation arrows - only show if pagination is possible */}
              {pagination.total > pagination.limit && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <Box
                    onClick={() => {
                      if (pagination.current > 1) {
                        const newPage = pagination.current - 1;
                        setPagination(prev => ({ ...prev, current: newPage }));
                        fetchTemplates(newPage);
                      }
                    }}
                    sx={{
                      cursor: pagination.current > 1 ? "pointer" : "not-allowed",
                      color: pagination.current > 1 ? COLORS.PAGINATION.DEFAULT : COLORS.PAGINATION.DISABLED,
                      padding: "4px",
                      borderRadius: "4px",
                      "&:hover": pagination.current > 1 ? {
                        backgroundColor: COLORS.PAGINATION.HOVER_BG,
                      } : {},
                    }}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
                  </Box>
                  <Box
                    onClick={() => {
                      if (pagination.current < Math.ceil(pagination.total / pagination.limit)) {
                        const newPage = pagination.current + 1;
                        setPagination(prev => ({ ...prev, current: newPage }));
                        fetchTemplates(newPage);
                      }
                    }}
                    sx={{
                      cursor: pagination.current < Math.ceil(pagination.total / pagination.limit) ? "pointer" : "not-allowed",
                      color: pagination.current < Math.ceil(pagination.total / pagination.limit) ? COLORS.PAGINATION.DEFAULT : COLORS.PAGINATION.DISABLED,
                      padding: "4px",
                      borderRadius: "4px",
                      "&:hover": pagination.current < Math.ceil(pagination.total / pagination.limit) ? {
                        backgroundColor: COLORS.PAGINATION.HOVER_BG,
                      } : {},
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default SchemaTemplateListing;
