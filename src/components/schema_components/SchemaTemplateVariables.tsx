import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { NovusDropdown } from "../Novus-MUI-wrappers";
import CodeEditor from "../commmon/CodeEditor";

// Base64 decoding function
const base64Decode = (encodedData: string): string => {
  if (!encodedData || typeof encodedData !== "string") {
    return "";
  }

  try {
    // Check if the data looks like base64 (contains only base64 characters)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(encodedData)) {
      console.log("Data does not appear to be base64 encoded, returning as-is");
      return encodedData;
    }

    const binaryString = atob(encodedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoded = new TextDecoder().decode(bytes);
    console.log("Successfully decoded base64 data");
    return decoded;
  } catch (error) {
    console.error("Error decoding base64:", error);
    console.log("Returning original data as fallback");
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
  { text: "Product", value: "product" },
  { text: "Collection", value: "collection" },
  { text: "Home", value: "home" },
  { text: "Products", value: "products" },
  { text: "Category", value: "category" },
  { text: "Brand", value: "brand" },
  { text: "Sections", value: "sections" },
  { text: "Page", value: "page" },
  { text: "Blog", value: "blog" },
];

// Helper function to normalize page type values
const normalizePageType = (pageType: string): string => {
  if (!pageType) return "";

  // Common variations that might be stored in the database
  const variations: Record<string, string> = {
    Product: "product",
    product: "product",
    PRODUCT: "product",
    Category: "category",
    category: "category",
    CATEGORY: "category",
    Brand: "brand",
    brand: "brand",
    BRAND: "brand",
    Collection: "collection",
    collection: "collection",
    COLLECTION: "collection",
    Article: "article",
    article: "article",
    ARTICLE: "article",
    Blog: "blog",
    blog: "blog",
    BLOG: "blog",
    Webpage: "webpage",
    webpage: "webpage",
    WEBPAGE: "webpage",
    WebPage: "webpage",
    web_page: "webpage",
    "web-page": "webpage",
  };

  return variations[pageType] || pageType.toLowerCase();
};

const SchemaTemplateVariables = forwardRef<any, SchemaTemplateVariablesProps>(
  (
    {
      isEditMode = false,
      schemaId,
      onSave,
      initialData,
      fetchSchemaTemplate,
      getDefaultSEOSchema,
    },
    ref
  ) => {
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedPageType, setSelectedPageType] = useState<{
      value: string;
      showerror: boolean;
      errortext: string;
    }>({
      value: "",
      showerror: false,
      errortext: "",
    });
    const [schemaData, setSchemaData] = useState("");
    const [jsonData, setJsonData] = useState("");
    const [renderData, setRenderData] = useState("");
    const [isJsonValueError, setIsJsonValueError] = useState(false);
    const [isJsonEditorError, setIsJsonEditorError] = useState(false);

    useEffect(() => {
      if (initialData) {
        console.log(
          "SchemaTemplateVariables - initialData received:",
          initialData
        );
        console.log(
          "SchemaTemplateVariables - initialData.schema type:",
          typeof initialData.schema
        );
        console.log(
          "SchemaTemplateVariables - initialData.schema value:",
          initialData.schema
        );
        console.log(
          "SchemaTemplateVariables - initialData.page_type:",
          initialData.page_type
        );
        console.log(
          "SchemaTemplateVariables - initialData.target_json:",
          initialData.target_json
        );

        const rawPageTypeValue = initialData.page_type || "";
        console.log(
          "SchemaTemplateVariables - raw page_type value:",
          rawPageTypeValue
        );

        // Normalize the page type value
        const normalizedPageType = normalizePageType(rawPageTypeValue);
        console.log(
          "SchemaTemplateVariables - normalized page_type value:",
          normalizedPageType
        );

        // Check if the normalized page_type value exists in PAGE_TYPE_LIST
        const validPageType = PAGE_TYPE_LIST.find(
          (option) => option.value === normalizedPageType
        );
        console.log(
          "SchemaTemplateVariables - valid page type found:",
          validPageType
        );

        setSelectedPageType({
          value: normalizedPageType,
          showerror: false,
          errortext: "",
        });

        // Decode schema data if it's base64 encoded
        let decodedSchema = "";
        if (initialData.schema) {
          // Check if it's already valid JSON (not base64 encoded)
          try {
            JSON.parse(initialData.schema);
            console.log("Schema appears to be already in JSON format");
            decodedSchema = initialData.schema;
          } catch {
            // Not valid JSON, try base64 decoding
            console.log("Schema is not valid JSON, attempting base64 decode");
            decodedSchema = base64Decode(initialData.schema);
          }
        }
        console.log("SchemaTemplateVariables - final schema:", decodedSchema);
        setSchemaData(decodedSchema);
        setRenderData(decodedSchema);

        // Handle target_json - it might be a string or object
        let jsonDataToSet = "";
        if (initialData.target_json) {
          if (typeof initialData.target_json === "string") {
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
        errortext: "",
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

          // Create default schema like the original Vue component
          const defaultSchema = JSON.stringify(
            {
              default: `This is default schema of ${pageType}`,
            },
            null,
            "\t"
          );

          const apiSchema = response?.data?.items?.[0]?.schema;
          const targetJson = response?.data?.items?.[0]?.target_json;

          console.log("API Schema received:", apiSchema);
          console.log("Target JSON received:", targetJson);

          // Set schema data like the original Vue component
          // If API returns actual schema, use it; otherwise use default
          const schemaToUse = apiSchema ? apiSchema.trim() : defaultSchema;
          setSchemaData(schemaToUse);
          setRenderData(schemaToUse);

          // Set JSON data like the original Vue component
          // If API returns target_json, use it; otherwise use empty object
          const jsonDataToSet = targetJson
            ? JSON.stringify(targetJson, null, " ")
            : JSON.stringify({}, null, " ");
          setJsonData(jsonDataToSet);
        } catch (error) {
          console.error("Error fetching default schema:", error);
          // Create fallback schema like the original Vue component
          const fallbackSchema = JSON.stringify(
            {
              default: `This is default schema of ${pageType}`,
            },
            null,
            "\t"
          );

          setSchemaData(fallbackSchema);
          setRenderData(fallbackSchema);
          setJsonData(JSON.stringify({}, null, " "));
        } finally {
          setPageLoading(false);
        }
      } else {
        // Create fallback schema like the original Vue component
        const fallbackSchema = JSON.stringify(
          {
            default: `This is default schema of ${pageType}`,
          },
          null,
          "\t"
        );

        setSchemaData(fallbackSchema);
        setRenderData(fallbackSchema);
        setJsonData(JSON.stringify({}, null, " "));
      }
    };

    const handleSchemaEdit = (value: string) => {
      setSchemaData(value);
      setRenderData(value);
      onSave?.({
        page_type: selectedPageType.value,
        schema: value,
        target_json: jsonData,
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
        target_json: value,
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
          target_json: jsonData,
        });
      } catch (error) {
        console.error("Invalid JSON format");
      }
    };

    const validate = (): boolean => {
      // Basic validation for variables component
      return !!(selectedPageType.value && schemaData && jsonData);
    };

    const getCurrentData = () => ({
      page_type: selectedPageType.value,
      schema: schemaData,
      target_json: jsonData,
    });

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      validate,
      getCurrentData,
    }));

    if (pageLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
        </Box>
      );
    }

    console.log(
      "SchemaTemplateVariables - rendering with selectedPageType:",
      selectedPageType
    );
    console.log("SchemaTemplateVariables - PAGE_TYPE_LIST:", PAGE_TYPE_LIST);
    console.log(
      "SchemaTemplateVariables - dropdown options:",
      PAGE_TYPE_LIST.map((pageType) => ({
        value: pageType.value,
        label: pageType.text,
      }))
    );

    // Check if the selected page type exists in the options
    const matchingOption = PAGE_TYPE_LIST.find(
      (option) => option.value === selectedPageType.value
    );
    console.log("SchemaTemplateVariables - matching option:", matchingOption);

    return (
      <Box sx={{ width: "100%", maxWidth: "100%" }}>
        <Box
          sx={{
            width: "100%",
            padding: "24px",
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              color: "#41434C",
              fontWeight: "500",
              fontSize: "16px",
              textAlign: "left",
            }}
          >
            Select Page
          </Typography>

          {/* Page Type Selection */}
          <Box>
            <FormControl fullWidth error={selectedPageType.showerror}>
              <NovusDropdown
                value={selectedPageType.value}
                onChange={(event: any) => handlePageTypeChange(event)}
                placeholder="Select a page"
                options={PAGE_TYPE_LIST.map((pageType) => ({
                  value: pageType.value,
                  label: pageType.text,
                }))}
                novusSize="md"
              />
              {selectedPageType.showerror && (
                <FormHelperText>{selectedPageType.errortext}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Typography
            sx={{
              color: "#41434C",
              fontWeight: "500",
              fontSize: "16px",
              textAlign: "left",
            }}
          >
            Schema
          </Typography>

          {/* Schema Editor */}
          <Box>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                width: "100%",
              }}
            >
              <CodeEditor
                value={schemaData}
                onChange={handleSchemaEdit}
                height="300px"
                language="schema"
                theme="dark"
              />
            </Box>
          </Box>

          {/* Preview Section */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: "column", lg: "row" },
              minHeight: 0,
              width: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
              alignItems: "flex-start",
            }}
          >
            {/* Example JSON */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", lg: "1 1 50%" },
                minWidth: 0,
                maxWidth: "100%",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#41434C",
                    fontWeight: "500",
                    fontSize: "16px",
                    textAlign: "left",
                  }}
                >
                  Example JSON
                </Typography>
                <Typography
                  component="button"
                  onClick={formatJson}
                  sx={{
                    color: "#2C4BFF",
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  Format
                </Typography>
              </Box>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <CodeEditor
                  value={jsonData}
                  onChange={handleJsonEdit}
                  height="300px"
                  language="json"
                  theme="dark"
                />
              </Box>
              {isJsonValueError && !isJsonEditorError && (
                <FormHelperText error sx={{ mt: 1 }}>
                  Please check your payload
                </FormHelperText>
              )}
            </Box>

            {/* Preview */}
            <Box
              sx={{
                flex: { xs: "1 1 100%", lg: "1 1 50%" },
                minWidth: 0,
                maxWidth: "100%",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  color: "#41434C",
                  fontWeight: "500",
                  fontSize: "16px",
                  textAlign: "left",
                  mb: 2,
                }}
              >
                Preview
              </Typography>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <CodeEditor
                  value={renderData}
                  onChange={() => {}} // Read-only, so no-op function
                  height="300px"
                  language="json"
                  readOnly={true}
                  theme="dark"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default SchemaTemplateVariables;
