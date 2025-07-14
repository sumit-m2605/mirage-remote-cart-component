import React from 'react';
import { Switch, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SwitchProps } from '@mui/material';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 34,
    height: 18,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    '& .MuiSwitch-switchBase': {
        padding: 3,
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#2C4BFF',
                opacity: 1,
                border: 0,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    '& .MuiSwitch-track': {
        borderRadius: 9, // 18px / 2
        backgroundColor: '#C7C7C7',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 300,
        }),
    },
}));


interface NovusToggleProps extends SwitchProps {
    label?: string;
    supportText?: string;
}

const NovusToggle: React.FC<NovusToggleProps> = ({ label, supportText, ...props }) => {
    return (
        <Box display="flex" flexDirection="column" gap={0.5}>
            {label && <Typography fontSize={14} fontWeight={500}>{label}</Typography>}
            <StyledSwitch {...props} />
            {supportText && <Typography fontSize={12} color="text.secondary">{supportText}</Typography>}
        </Box>
    );
};

export default NovusToggle;
