import React from "react";
import type { ButtonProps } from "@mui/material";
declare const colorMap: {
    default: "#3535F3";
    contrast: string;
    positive: string;
    negative: string;
    warning: string;
    ai: string;
};
type Appearance = keyof typeof colorMap;
type NovusSize = "xs" | "sm" | "md" | "lg" | "xl";
type VariantType = "primary" | "secondary" | "tertiary";
interface NovusButtonProps extends Omit<ButtonProps, "size"> {
    appearance?: Appearance;
    variantType?: VariantType;
    novusSize?: NovusSize;
    loading?: boolean;
    padding?: string;
}
declare const NovusButton: React.FC<NovusButtonProps>;
export default NovusButton;
