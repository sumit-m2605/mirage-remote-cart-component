import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

// Color constants
const COLORS = {
  BACKGROUND: '#ffffff',
  TEXT_PRIMARY: '#141414',
  TEXT_SECONDARY: '#000000',
  TEXT_WHITE: '#ffffff',
  BORDER_SHADOW: 'rgba(0, 0, 0, 0.1)',
  MENU_BACKGROUND: '#FFFFFF',
  MENU_BORDER: '#FFFFFF',
  MENU_SHADOW: '0px 4px 16px 0px rgba(0, 0, 0, 0.24), 0px 0px 8px 0px rgba(255, 255, 255, 0.3)',
  MENU_ITEM_TEXT: '#141414',
  MENU_ITEM_HOVER: '#F5F5F5',
  MENU_ITEM_SELECTED_BG: '#F0F0FF',
  MENU_ITEM_SELECTED_TEXT: '#000093',
  MENU_ITEM_SELECTED_HOVER: '#E8E8FC',
  MENU_ITEM_DISABLED: '#A0AEC0',
  SCROLLBAR_THUMB: '#D4D4D4',
  SCROLLBAR_THUMB_HOVER: '#B8B8B8',
} as const;

interface RemotePageHeaderProps {
  title: string;
  onBack: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
  renderActions?: React.ReactNode;
  showBackButton?: boolean;
  logo?: string;
  tags?: boolean;
}

// Styled components to match original design
const PageHeaderContainer = styled(Box)(() => ({
  position: 'sticky',
  top: 0,
  zIndex: 6,
  backgroundColor: COLORS.BACKGROUND,
  boxShadow: `0 1px 0px 0 ${COLORS.BORDER_SHADOW}`,
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 24px',
  
}));

const PageNav = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'auto 2fr auto',
  alignItems: 'center',  
}));

const BackButtonTitle = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  
}));

const PageTitle = styled(Typography)(() => ({
  color: COLORS.TEXT_PRIMARY,
  height: 'auto',
  fontSize: '24px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  
}));

const PageSlot = styled(Box)<{ tags?: boolean }>(({ tags }) => ({
  display: 'flex',
  flex: 1,
  gap: '0.5rem',
  justifyContent: tags ? 'space-between' : 'flex-end',
  paddingLeft: '1rem',
  
}));

const BackButton = styled(IconButton)(() => ({
  cursor: 'pointer',
  marginRight: '10px',
  
}));

const MenuButton = styled(IconButton)(() => ({
  padding: '0px',
  marginLeft: '8px',
}));

const RemotePageHeader: React.FC<RemotePageHeaderProps> = ({
  title,
  onBack,
  helpSlug = 'helpHome',
  helpDocsURLs,
  renderActions,
  showBackButton = true,
  logo,
  tags = false
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleHelpClick = () => {
    const url = helpDocsURLs[helpSlug] || helpDocsURLs.helpHome;
    window.open(url, '_blank');
    handleMenuClose();
  };

  return (
    <PageHeaderContainer>
      <PageNav>
        <BackButtonTitle>
          {showBackButton && (
            <>
              <BackButton onClick={onBack} size="small">
                <ArrowBackIcon />
              </BackButton>
            </>
          )}
          {title && (
            <PageTitle
              className={!showBackButton && isMobile ? 'hide-back-btn' : ''}
              style={!showBackButton && isMobile ? { paddingLeft: '24px' } : {}}
            >
              {logo && <img src={logo} className="page-logo" alt="logo" />}
              <span>{title}</span>
            </PageTitle>
          )}
        </BackButtonTitle>

        <PageSlot tags={tags}>
          {renderActions}
        </PageSlot>

        <MenuButton onClick={handleMenuClick}>
          <MoreVertIcon/>
        </MenuButton>

        <Menu 
          anchorEl={anchorEl} 
          open={open} 
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: COLORS.MENU_BACKGROUND,
              border: `1px solid ${COLORS.MENU_BORDER}`,
              borderRadius: '8px',
              boxShadow: COLORS.MENU_SHADOW,
              padding: '4px',
              maxHeight: '250px',
              height: 'fit-content',
              width: 'fit-content',
              minWidth: '120px',
              overflow: 'auto',
              margin: '4px 0px',
              '& .MuiList-root': {
                paddingTop: '0 !important',
                paddingBottom: '0 !important',
                width: '100%',
              },
              '& .MuiMenuItem-root': {
                fontFamily: '"Inter", sans-serif !important',
                fontSize: '12px !important',
                lineHeight: '1.5em !important',
                fontWeight: 400,
                color: COLORS.MENU_ITEM_TEXT,
                padding: '8px 12px',
                borderRadius: '8px',
                margin: '2px 0',
                minHeight: 'auto',
                height: '32px',
                width: '100% !important',
                minWidth: '100% !important',
                '& .MuiTypography-root': {
                  fontSize: '12px !important',
                  lineHeight: '1.5em !important',
                },
                '&:hover': {
                  backgroundColor: COLORS.MENU_ITEM_HOVER,
                },
                '&.Mui-selected': {
                  backgroundColor: COLORS.MENU_ITEM_SELECTED_BG,
                  color: COLORS.MENU_ITEM_SELECTED_TEXT,
                  '&:hover': {
                    backgroundColor: COLORS.MENU_ITEM_SELECTED_HOVER,
                  },
                },
                '&.Mui-disabled': {
                  color: COLORS.MENU_ITEM_DISABLED,
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
                background: COLORS.SCROLLBAR_THUMB,
                borderRadius: '250px',
                width: '4px !important',
                height: '280px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: COLORS.SCROLLBAR_THUMB_HOVER,
              },
            },
          }}
        >
          <MenuItem onClick={handleHelpClick}>Help</MenuItem>
        </Menu>
      </PageNav>
    </PageHeaderContainer>
  );
};

export default RemotePageHeader;
 