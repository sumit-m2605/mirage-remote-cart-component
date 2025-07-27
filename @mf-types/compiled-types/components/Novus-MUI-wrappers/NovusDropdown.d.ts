import React from 'react';
import type { SelectProps } from '@mui/material';
export interface NovusDropdownProps extends Omit<SelectProps, 'variant' | 'label'> {
    label?: string;
    required?: boolean;
    variantType?: 'default' | 'error' | 'success';
    novusSize?: 'sm' | 'md' | 'lg';
    showHelpIcon?: boolean;
    helperText?: string;
    placeholder?: string;
    options: Array<{
        value: string | number;
        label: string;
        disabled?: boolean;
        icon?: React.ReactNode;
        secondaryText?: string;
    }>;
    selectedIcon?: React.ReactNode;
}
declare const NovusDropdownComponent: React.FC<NovusDropdownProps>;
export default NovusDropdownComponent;
