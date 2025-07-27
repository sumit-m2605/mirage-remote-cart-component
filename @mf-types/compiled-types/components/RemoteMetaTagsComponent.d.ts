import React from "react";
import type { MetaTag } from "./meta_components/MetaTags.tsx";
interface Props {
    fetchCustomMetaTags: () => Promise<MetaTag[]>;
    updateCustomMetaTags: (list: MetaTag[]) => Promise<void>;
    onCancel: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
}
declare const MetaTagsRemote: React.FC<Props>;
export default MetaTagsRemote;
