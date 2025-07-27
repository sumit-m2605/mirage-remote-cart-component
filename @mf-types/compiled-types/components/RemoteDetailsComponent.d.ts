import React from "react";
interface AppInfo {
    name?: string;
    description?: string;
    image_url?: string;
    domains?: Array<{
        name: string;
        is_primary: boolean;
    }>;
}
interface SEODataResponse {
    details?: {
        title?: string;
        description?: string;
        image_url?: string;
    };
    sitemap?: {
        priority: number;
        frequency: string;
    };
}
interface Props {
    fetchAppInfo: () => Promise<AppInfo>;
    fetchSEO: () => Promise<{
        seo: SEODataResponse;
    }>;
    updateSEO: (data: {
        details: any;
        sitemap: any;
    }) => Promise<{
        details: any;
    }>;
    generateSEO: (body: any, type: string) => Promise<any>;
    uploadImage?: (file: File) => Promise<string>;
    fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
    fetchBrandImages?: (params: any) => Promise<any>;
    fetchCollectionImages?: (params: any) => Promise<any>;
    fetchProductImages?: (params: any) => Promise<any>;
    onCancel: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
}
declare const DetailsRemote: React.FC<Props>;
export default DetailsRemote;
