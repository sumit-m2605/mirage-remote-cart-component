import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography} from '@mui/material';
import { NovusInput } from '../Novus-MUI-wrappers';
import './SchemaTemplateVariables.css';

interface FormField {
  value: string;
  showerror: boolean;
  errortext: string;
}

interface SchemaTemplateEditProps {
  isEditMode?: boolean;
  schemaId?: string;
  onSave?: (data: any) => void;
  initialData?: any;
  systemDisableEdit?: boolean;
}

const SchemaTemplateEdit = forwardRef<any, SchemaTemplateEditProps>(({
  onSave,
  initialData,
  systemDisableEdit = false
}, ref) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(false);
  const [formFieldNames] = useState(['title', 'description']);
  const [validLength] = useState({ title: 200, desc: 300, message: 500 });
  const [MAX_DESCRIPTION_CHAR_LIMIT] = useState(300);

  const [data, setData] = useState<{
    title: FormField;
    description: FormField;
  }>({
    title: getInitialValue(),
    description: getInitialValue()
  });

  function getInitialValue(val = ''): FormField {
    return {
      showerror: false,
      value: val,
      errortext: ''
    };
  }

  useEffect(() => {
    try {
      if (initialData) {
        const obj: any = {};
        formFieldNames.forEach(key => {
          const keyValue = initialData[key] || '';
          obj[key] = getInitialValue(keyValue);
        });
        setData(prev => ({ ...prev, ...obj }));
      }
      setPageLoading(false);
    } catch (err) {
      console.error(err);
      setPageLoading(false);
      setPageError(true);
    }
  }, [initialData, formFieldNames]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setData(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName as keyof typeof prev],
        value,
        showerror: false,
        errortext: ''
      }
    }));
  };

  const validate = (): boolean => {
    let has_error = false;
    const newData = { ...data };

    // Reset errors
    formFieldNames.forEach(key => {
      if (!newData[key as keyof typeof newData]) {
        newData[key as keyof typeof newData] = getInitialValue();
      }
      if (newData[key as keyof typeof newData]) {
        newData[key as keyof typeof newData].errortext = '';
        newData[key as keyof typeof newData].showerror = false;
      }
    });

    // Validate required fields
    const requiredFields = ['title'];
    const requiredEmptyArr = requiredFields.filter(
      key => !(newData[key as keyof typeof newData] && newData[key as keyof typeof newData].value)
    );

    if (requiredEmptyArr.length > 0) {
      has_error = true;
      requiredEmptyArr.forEach(key => {
        let displayName = key[0].toUpperCase();
        if (key === 'title') {
          displayName = 'Title';
        }
        newData[key as keyof typeof newData].errortext = `${displayName + key.slice(1)} cannot be empty`;
        newData[key as keyof typeof newData].showerror = true;
      });
    }

    setData(newData);
    return requiredEmptyArr.length === 0 && !has_error;
  };

  const saveForm = () => {
    if (validate()) {
      const finalObj: any = {};
      formFieldNames.forEach(key => {
        if (data[key as keyof typeof data].value) {
          finalObj[key] = data[key as keyof typeof data].value;
        } else {
          finalObj[key] = '';
        }
      });
      onSave?.(finalObj);
    }
  };

  const getCurrentData = () => {
    const finalObj: any = {};
    formFieldNames.forEach(key => {
      if (data[key as keyof typeof data].value) {
        finalObj[key] = data[key as keyof typeof data].value;
      } else {
        finalObj[key] = '';
      }
    });
    return finalObj;
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    validate,
    saveForm,
    getCurrentData
  }));

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (pageError) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">Failed to load Schema</Typography>
      </Box>
    );
  }

  return (
      <Box sx={{ 
        width: '100%', 
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Typography
          sx={{
            color: '#41434C',
            fontWeight: '500',
            fontSize: '16px',
            textAlign: 'left',
          }}
        >
          Details
        </Typography>

        {/* Title Field */}
          <NovusInput
            label="Title"
            placeholder="Enter Title"
            value={data.title.value}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            disabled={systemDisableEdit}
            maxLength={validLength.title}
            variantType={data.title.showerror ? 'error' : 'default'}
            helperText={data.title.showerror ? data.title.errortext : undefined}
            novusSize="md"
            required
            fullWidth
          />

        {/* Description Field */}
          <NovusInput
            label={`Description`}
            placeholder="Enter description"
            value={data.description.value}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            disabled={systemDisableEdit}
            multiline
            rows={4}
            maxLength={validLength.desc}
            variantType={data.description.showerror ? 'error' : 'default'}
            helperText={data.description.showerror ? data.description.errortext : undefined}
            novusSize="md"
            showCharacterCount
            fullWidth
          />
      </Box>
  );
});

export default SchemaTemplateEdit; 