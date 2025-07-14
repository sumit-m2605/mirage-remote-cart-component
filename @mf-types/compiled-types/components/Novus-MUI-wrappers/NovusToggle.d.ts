import React from 'react';
import type { SwitchProps } from '@mui/material';
interface NovusToggleProps extends SwitchProps {
    label?: string;
    supportText?: string;
}
declare const NovusToggle: React.FC<NovusToggleProps>;
export default NovusToggle;
