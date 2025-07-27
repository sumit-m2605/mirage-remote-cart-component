import React from "react";
import type { TextFieldProps } from "@mui/material";
export interface NovusInputProps extends Omit<TextFieldProps, "variant" | "label"> {
    label?: string;
    required?: boolean;
    variantType?: "default" | "error" | "success";
    novusSize?: "sm" | "md" | "lg";
    showHelpIcon?: boolean;
    showCharacterCount?: boolean;
    maxLength?: number;
}
declare const NovusInputComponent: React.FC<NovusInputProps>;
export default NovusInputComponent;
