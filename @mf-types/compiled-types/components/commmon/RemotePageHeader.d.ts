import React from 'react';
interface RemotePageHeaderProps {
    title: string;
    onBack: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
    renderActions?: React.ReactNode;
    showBackButton?: boolean;
    logo?: string;
    tags?: boolean;
}
declare const RemotePageHeader: React.FC<RemotePageHeaderProps>;
export default RemotePageHeader;
