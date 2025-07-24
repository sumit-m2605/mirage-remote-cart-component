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
const PageHeaderContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 6,
  height: '58.5px',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 0px 0 rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
  }
}));

const PageNav = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'auto 2fr auto',
  minHeight: '56.5px',
  margin: 'auto 24px',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    backgroundColor: '#3535F3',
    margin: 0,
    padding: '0 6px 0 0',
  }
}));

const BackButtonTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    alignItems: 'center',
    position: 'static',
    marginLeft: '0px',
  }
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: '#2C2C2C',
  fontSize: '24px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  '& .page-logo': {
    height: '40px',
    marginRight: '10px',
  },
  [theme.breakpoints.down('md')]: {
    color: '#ffffff',
    fontWeight: 'normal',
    fontSize: '18px',
    width: '100%',
  }
}));

const PageSlot = styled(Box)<{ tags?: boolean }>(({ theme, tags }) => ({
  display: 'flex',
  flex: 1,
  gap: '0.5rem',
  justifyContent: tags ? 'space-between' : 'flex-end',
  paddingLeft: '1rem',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const MobileIcon = styled(IconButton)(({ theme }) => ({
  display: 'none',
  transform: 'rotate(90deg)',
  paddingBottom: '6px',
  color: '#ffffff',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  }
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  cursor: 'pointer',
  marginRight: '10px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginLeft: '8px',
  [theme.breakpoints.down('md')]: {
    marginLeft: 'auto',
  }
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
              <MobileIcon onClick={onBack} size="small">
                <ArrowBackIcon />
              </MobileIcon>
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
          <MoreVertIcon style={{ height: '30px', width: '30px', color: isMobile ? '#ffffff' : '#000000' }} />
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
          style={{ marginTop: '47px' }}
        >
          <MenuItem onClick={handleHelpClick}>Help</MenuItem>
        </Menu>
      </PageNav>
    </PageHeaderContainer>
  );
};

export default RemotePageHeader;
 