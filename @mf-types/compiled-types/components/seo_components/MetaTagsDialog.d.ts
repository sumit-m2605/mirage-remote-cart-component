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
    onSave: (data: MetaTag) => void;
    onUpdate: (data: {
        tags: MetaTag;
        index: number;
    }) => void;
    metaTags: MetaTag[];
    editData?: {
        data: MetaTag;
        index: number;
    };
}
declare const MetaTagsDialog: React.FC<Props>;
export default MetaTagsDialog;
