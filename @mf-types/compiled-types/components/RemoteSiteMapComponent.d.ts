import React from "react";
interface Props {
    fetchSitemapStatus: () => Promise<{
        enabled: boolean;
        content: string;
    }>;
    updateSitemapStatus: (enabled: boolean) => Promise<boolean>;
    updateSitemapContent: (content: string) => Promise<boolean>;
    onCancel: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
}
declare const SitemapRemote: React.FC<Props>;
export default SitemapRemote;
