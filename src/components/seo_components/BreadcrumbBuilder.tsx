import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NovusDropdown } from "../Novus-MUI-wrappers";

// Color constants
const COLORS = {
  border: {
    primary: '#E4E5E6'
  },
  background: {
    secondary: '#F5F5F5'
  }
} as const;

// Breadcrumb types data
const BREADCRUMB_TYPES = [
  {
    display_name: "Brand",
    page_type: "brand",
    description: "List of products belonging to a specific brand",
    icon: "",
    params: [],
    query: [
      {
        key: "brand",
        name: "Brand",
        required: true,
        multiple: false,
      },
    ],
  },
  {
    display_name: "Collection",
    page_type: "collection",
    description: "A page displaying 1 specific collection of items",
    icon: "",
    params: [
      {
        key: "slug",
        name: "Collection",
        required: true,
      },
    ],
    query: [],
  },
  {
    display_name: "Department",
    page_type: "products-department",
    description: "Display all products under one department",
    icon: "",
    params: [],
    query: [
      {
        key: "department",
        name: "Department",
        required: true,
        multiple: false,
      },
    ],
  },
  {
    display_name: "Level 1 Category",
    page_type: "products-l1_category",
    description: "Display all products under a level 1 category",
    icon: "",
    params: [],
    query: [
      {
        key: "l1_category",
        name: "Level 1 Category",
        required: true,
        multiple: false,
      },
    ],
  },
  {
    display_name: "Level 2 Category",
    page_type: "products-l2_category",
    description: "Display all products under a level 2 category",
    icon: "",
    params: [
      {
        key: "l2_category",
        name: "Level 2 Category",
        required: true,
        multiple: false,
      },
    ],
  },
];

interface Breadcrumb {
  url?: string;
  action?: any;
}

interface Props {
  breadcrumb: Breadcrumb;
  existingBreadcrumbs: Breadcrumb[];
  onUpdateBreadcrumb: (breadcrumbs: any[]) => void;
  onDeleteBreadcrumb: () => void;
}

const BreadcrumbBuilder: React.FC<Props> = ({
  breadcrumb,
  existingBreadcrumbs,
  onUpdateBreadcrumb,
  onDeleteBreadcrumb,
}) => {
  const [levelType, setLevelType] = useState<string>("");
  const [pathParams, setPathParams] = useState<any[]>([]);
  const [queryParams, setQueryParams] = useState<any[]>([]);
  const [selectedPathValues, setSelectedPathValues] = useState<Record<string, any>>({});
  const [selectedQueryValues, setSelectedQueryValues] = useState<Record<string, any>>({});

  const levelTypeOptions = BREADCRUMB_TYPES.map((type) => ({
    text: type.display_name,
    value: type.page_type,
    description: type.description,
  }));

  const selectedLevelTypeData = levelTypeOptions.find(
    (option) => option.value === levelType
  );

  useEffect(() => {
    if (breadcrumb?.action) {
      // Initialize with existing breadcrumb data
      initializeBreadcrumb(breadcrumb.action);
    }
  }, [breadcrumb]);

  const initializeBreadcrumb = (action: any) => {
    // This would contain logic to parse the existing action and set the form state
    // For now, we'll just set a default level type
    if (action?.page?.type) {
      setLevelType(action.page.type);
      // Load params and queries based on the type
      loadParamsAndQueries(action.page.type);
    }
  };

  const loadParamsAndQueries = (type: string) => {
    const typeData = BREADCRUMB_TYPES.find((t) => t.page_type === type);
    if (typeData) {
      setPathParams(typeData.params || []);
      setQueryParams(typeData.query || []);
    }
  };

  const handleLevelTypeChange = (event: any) => {
    const newLevelType = event.target.value;
    setLevelType(newLevelType);
    loadParamsAndQueries(newLevelType);
    setSelectedPathValues({});
    setSelectedQueryValues({});
    generateURL();
  };

  const handlePathParamChange = (paramKey: string, value: any) => {
    setSelectedPathValues((prev) => ({
      ...prev,
      [paramKey]: value,
    }));
    generateURL();
  };

  const handleQueryParamChange = (paramKey: string, value: any) => {
    setSelectedQueryValues((prev) => ({
      ...prev,
      [paramKey]: value,
    }));
    generateURL();
  };

  const generateURL = () => {
    // This would contain the logic to generate the URL based on selected parameters
    // For now, we'll create a simple action object
    const action = {
      page: {
        params: selectedPathValues,
        query: selectedQueryValues,
        type: levelType,
      },
      type: "page",
    };

    // Emit the updated breadcrumb
    const updatedBreadcrumbs = existingBreadcrumbs.map((bc) => {
      if (bc === breadcrumb) {
        return {
          ...bc,
          action,
          url: generateURLFromAction(action),
        };
      }
      return bc;
    });

    onUpdateBreadcrumb(updatedBreadcrumbs);
  };

  const generateURLFromAction = (action: any) => {
    // This would contain the logic to convert action to URL
    // For now, return a placeholder
    return `/generated-url-${Date.now()}`;
  };

  return (
    <Box
      border={1}
      borderColor={COLORS.border.primary}
      borderRadius={1}
      p={2}
      mb={2}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Breadcrumb Level
        </Typography>
        <IconButton onClick={onDeleteBreadcrumb} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>

      {/* Level Type Dropdown */}
      <FormControl fullWidth>
        <NovusDropdown
          value={levelType}
          onChange={handleLevelTypeChange}
          options={levelTypeOptions.map(option => ({
            value: option.value,
            label: option.text,
            secondaryText: option.description
          }))}
          placeholder="Select Level Type"
          novusSize="md"
        />
      </FormControl>

      {/* Path Parameters */}
      {pathParams.length > 0 && (
        <Box>
          <Typography variant="subtitle2" mb={1}>
            Path Parameters
          </Typography>
          {pathParams.map((param) => (
            <FormControl key={param.key} fullWidth sx={{ mb: 1 }}>
              <NovusDropdown
                value={selectedPathValues[param.key] || ""}
                onChange={(e) => handlePathParamChange(param.key, e.target.value)}
                options={[
                  { value: "", label: `Select ${param.name || param.key}` },
                  { value: "sample-value", label: "Sample Value" }
                ]}
                placeholder={`Select ${param.name || param.key}`}
                novusSize="md"
              />
            </FormControl>
          ))}
        </Box>
      )}

      {/* Query Parameters */}
      {queryParams.length > 0 && (
        <Box>
          <Typography variant="subtitle2" mb={1}>
            Query Parameters
          </Typography>
          {queryParams.map((param) => (
            <FormControl key={param.key} fullWidth sx={{ mb: 1 }}>
              <NovusDropdown
                value={selectedQueryValues[param.key] || ""}
                onChange={(e) => handleQueryParamChange(param.key, e.target.value)}
                options={[
                  { value: "", label: `Select ${param.name || param.key}` },
                  { value: "sample-value", label: "Sample Value" }
                ]}
                placeholder={`Select ${param.name || param.key}`}
                novusSize="md"
              />
            </FormControl>
          ))}
        </Box>
      )}

      {/* Generated URL Preview */}
      {breadcrumb.url && (
        <Box>
          <Typography variant="subtitle2" mb={1}>
            Generated URL
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{
              wordBreak: "break-all",
              p: 1,
              bgcolor: COLORS.background.secondary,
              borderRadius: 1,
            }}
          >
            {breadcrumb.url}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BreadcrumbBuilder; 