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

// Color definitions
const COLORS = {
  CARD: {
    BORDER: '#E0E0E0',
    BACKGROUND: '#FAFAFA',
    HOVER_BORDER: '#000093',
    HOVER_SHADOW: '#2C4BFF1A',
  },
  AVATAR: {
    BACKGROUND: '#2E31BE',
    TEXT: '#FFFFFF',
  },
  TEXT: {
    PRIMARY: '#41434C',
    SECONDARY: '#9B9B9B',
  },
  STATUS: {
    ACTIVE: '#00B140',
    INACTIVE: '#FF7F00',
    TEXT: '#FFFFFF',
  },
};

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
        border: `1px solid ${COLORS.CARD.BORDER}`,
        background: COLORS.CARD.BACKGROUND,
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          borderColor: COLORS.CARD.HOVER_BORDER,
          boxShadow: COLORS.CARD.HOVER_SHADOW
        }
      }}
    >
      {/* Avatar Section */}
      <Box sx={{ mr: 2 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            backgroundColor: COLORS.AVATAR.BACKGROUND,
            color: COLORS.AVATAR.TEXT,
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
            color: COLORS.TEXT.PRIMARY,
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
            color: COLORS.TEXT.SECONDARY,
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
            color: COLORS.TEXT.SECONDARY,
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
            backgroundColor: template.active ? COLORS.STATUS.ACTIVE : COLORS.STATUS.INACTIVE,
            color: COLORS.STATUS.TEXT,
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