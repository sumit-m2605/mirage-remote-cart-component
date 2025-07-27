import React from "react";
interface Props {
    fetchCanonicalEnabled: () => Promise<boolean>;
    updateCanonicalEnabled: (value: boolean) => Promise<boolean>;
    onCancel: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
}
declare const CanonicalTagRemote: React.FC<Props>;
export default CanonicalTagRemote;
