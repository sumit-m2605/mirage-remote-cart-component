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
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 0px 0 rgba(0, 0, 0, 0.1)',
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
  color: '#141414',
  height: '32px',
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
          <MoreVertIcon style={{color: isMobile ? '#ffffff' : '#000000' }} />
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
        >
          <MenuItem onClick={handleHelpClick}>Help</MenuItem>
        </Menu>
      </PageNav>
    </PageHeaderContainer>
  );
};

export default RemotePageHeader;
 