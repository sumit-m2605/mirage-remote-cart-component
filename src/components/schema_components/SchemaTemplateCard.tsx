import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar
} from '@mui/material';

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

interface SchemaTemplateCardProps {
  template: SchemaTemplate;
  onEdit: (template: SchemaTemplate) => void;
}

const SchemaTemplateCard: React.FC<SchemaTemplateCardProps> = ({
  template,
  onEdit
}) => {
  const handleClick = () => {
    console.log('SchemaTemplateCard - template clicked:', template);
    onEdit(template);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toDateString();
  };

  return (
    <Box
      onClick={handleClick}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px',
        gap: '12px',
        alignSelf: 'stretch',
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
        background: '#FAFAFA',
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'rgba(0, 0, 147, 1)',
          boxShadow: '0 2px 8px rgba(44, 75, 255, 0.1)'
        }
      }}
    >
      {/* Avatar Section */}
      <Box sx={{ mr: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            backgroundColor: '#2C4BFF',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          {getInitials(template.title)}
        </Avatar>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#41434C',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {template.title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: '#9b9b9b',
            fontSize: '14px',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {template.description}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            color: '#9b9b9b',
            fontSize: '12px'
          }}
        >
          Created on {formatDate(template.created_at)}
        </Typography>
      </Box>

      {/* Badge Section */}
      <Box sx={{ ml: 2 }}>
        <Chip
          label={template.active ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            backgroundColor: template.active ? '#00B140' : '#FF7F00',
            color: '#fff',
            fontWeight: 500,
            fontSize: '12px',
            height: '24px',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default SchemaTemplateCard; 