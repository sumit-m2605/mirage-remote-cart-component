import React from "react";
interface MetaTagItem {
    key: string;
    value: string;
}
interface MetaTag {
    title: string;
    items: MetaTagItem[];
}
interface Props {
    open: boolean;
    onClose: () => void;
    metaTags: MetaTag[];
}
declare const MetaPreviewDialog: React.FC<Props>;
export default MetaPreviewDialog;
