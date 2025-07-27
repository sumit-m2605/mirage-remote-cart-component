import React from "react";
import type { MetaTag } from "./MetaTags";
interface Props {
    open: boolean;
    meta: MetaTag | null;
    onClose: () => void;
    onSave: (meta: MetaTag) => void;
}
declare const MetaDialog: React.FC<Props>;
export default MetaDialog;
