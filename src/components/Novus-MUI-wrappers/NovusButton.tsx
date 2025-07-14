// components/shared/NovusButton/NovusButton.tsx

import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';

const colorMap = {
    default: {
        background: '#3535f3',
        text: '#FFFFFF',
        border: 'none',
    },
    contrast: {
        background: '#FFFFFF',
        text: '#2C4BFF',
        border: '1px solid #2C4BFF',
    },
    positive: {
        background: '#00B140',
        text: '#FFFFFF',
        border: 'none',

    },
    error: {
        background: '#FF3B3B',
        text: '#FFFFFF',
        border: 'none',
    },
    warning: {
        background: '#FF7F00',
        text: '#FFFFFF',
        border: 'none',
    }
};

interface NovusButtonProps extends ButtonProps {
    novusColor?: keyof typeof colorMap;
}

const StyledNovusButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'novusColor',
})<NovusButtonProps>(({ novusColor = 'default' }) => {
    const color = colorMap[novusColor];

    return {
        borderRadius: 999,
        fontWeight: 600,
        padding: '10px 24px',
        fontSize: '14px',
        backgroundColor: color.background,
        color: color.text,
        border: color.border || 'none',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: color.background,
            opacity: 0.9,
            boxShadow: 'none',
        },
        '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            backgroundColor: color.background,
            color: color.text,
        },
    };
});

const NovusButton: React.FC<NovusButtonProps> = (props) => {
    return <StyledNovusButton {...props} />;
};

export default NovusButton;
