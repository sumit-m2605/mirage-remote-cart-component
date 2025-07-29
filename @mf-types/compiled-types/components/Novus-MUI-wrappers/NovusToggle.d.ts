import React from "react";
import type { SwitchProps } from "@mui/material";
interface NovusToggleProps extends Omit<SwitchProps, 'size'> {
    label?: string;
    supportText?: string;
    labelPosition?: "left" | "right" | "top" | "bottom";
    labelColor?: string;
    size?: "sm" | "md" | "lg";
}
declare const NovusToggle: React.FC<NovusToggleProps>;
export default NovusToggle;
