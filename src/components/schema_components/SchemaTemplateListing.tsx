import React, { useState, useEffect, useCallback } from "react";
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

  const fetchTemplates = useCallback(async (pageOverride?: number) => {
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
  }, [fetchSchemaTemplates, pagination.limit, selectedFilter, searchText, pagination.current]);

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

  // Debounced search effect
  const debouncedSearch = useCallback(
    debounce(() => {
      setPagination((prev) => ({ ...prev, current: 1 }));
      fetchTemplates(1);
    }, 500),
    [fetchTemplates]
  );

  // Effect for search and filter changes
  useEffect(() => {
    if (searchText !== "" || selectedFilter !== "all") {
      debouncedSearch();
    }
  }, [searchText, selectedFilter, debouncedSearch]);

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
    <Box sx={{ mt: 2.5 , pb: '20px !important'}}>
      {/* Search and Filter Section */}
      {(loading ||
        searchText !== "" ||
        selectedFilter !== "all" ||
        templates.length > 0) && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              padding: 1.5,
              alignItems: "flex-start",
              gap: 1.25,
              borderRadius: 1,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Box
              sx={{
                display: "flex",
                height: 40,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 1.25,
                flex: 1,
                borderRadius: 1,
                px: 1.5,
              }}
            >
              <NovusInput
                placeholder="Search here"
                value={searchText}
                onChange={handleSearchChange}
                novusSize="md"
                fullWidth
              />
            </Box>
            <FormControl sx={{ minWidth: 120 }}>
              <NovusDropdown
                value={selectedFilter}
                onChange={handleFilterChange}
                options={PAGE_FILTERS.map(filter => ({
                  value: filter.value,
                  label: filter.text
                }))}
                placeholder="Filter"
                novusSize="md"
              />
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Templates List */}
      {templates.length > 0 ? (
        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 2 }}>
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

      {/* Pagination */}
      {pagination.total > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 , mb: 5 }}>
          <Pagination
            count={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.current}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
};

export default SchemaTemplateListing;
