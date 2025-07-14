import React from 'react';
import type { ButtonProps } from '@mui/material';
declare const colorMap: {
    default: {
        background: string;
        text: string;
        border: string;
    };
    contrast: {
        background: string;
        text: string;
        border: string;
    };
    positive: {
        background: string;
        text: string;
        border: string;
    };
    error: {
        background: string;
        text: string;
        border: string;
    };
    warning: {
        background: string;
        text: string;
        border: string;
    };
};
interface NovusButtonProps extends ButtonProps {
    novusColor?: keyof typeof colorMap;
}
declare const NovusButton: React.FC<NovusButtonProps>;
export default NovusButton;
