import React from 'react';
import type { SnackbarProps } from '@mui/material';
type SnackbarSeverityType = 'success' | 'error' | 'warning' | 'info';
interface NovusSnackbarProps extends Omit<SnackbarProps, 'message'> {
    severity?: SnackbarSeverityType;
    title?: string;
    message?: string;
    closable?: boolean;
    showIcon?: boolean;
    autoHide?: boolean;
    autoHideDuration?: number;
    onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}
declare const NovusSnackbar: React.FC<NovusSnackbarProps>;
export default NovusSnackbar;
export type { NovusSnackbarProps, SnackbarSeverityType };
