import React from 'react';
interface InfoBoxProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    flex?: string | {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
    };
    bgcolor?: string;
    borderRadius?: number;
    boxShadow?: number;
    titleFontWeight?: number | string;
    titleMarginBottom?: number;
    descriptionFontSize?: string;
    descriptionColor?: string;
    listItems?: string[];
    listStyle?: 'bullet' | 'number' | 'none';
}
declare const InfoBox: React.FC<InfoBoxProps>;
export default InfoBox;
