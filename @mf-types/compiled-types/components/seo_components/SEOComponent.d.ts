import React from "react";
interface SEOData {
    title: string;
    description: string;
    image_url: string;
    breadcrumbs: Array<{
        url?: string;
        action?: any;
    }>;
    sitemap: {
        priority: number;
        frequency: string;
    };
    meta_tags: Array<{
        title: string;
        items: Array<{
            key: string;
            value: string;
        }>;
    }>;
    canonical_url: string;
}
interface Props {
    value: SEOData;
    url?: string;
    text?: string;
    type?: string;
    showImageUploader?: boolean;
    breadcrumbEnabled?: boolean;
    sitemapEnabled?: boolean;
    metaTagsEnabled?: boolean;
    canonicalUrlEnabled?: boolean;
    onUpdate: (data: SEOData) => void;
    generateSEO: (body: any, type: string) => Promise<any>;
    showSnackbar: (message: string, type: "success" | "error") => void;
    uploadImage?: (file: File) => Promise<string>;
    fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
    fetchBrandImages?: (params: any) => Promise<any>;
    fetchCollectionImages?: (params: any) => Promise<any>;
    fetchProductImages?: (params: any) => Promise<any>;
}
declare const SEOComponent: React.FC<Props>;
export default SEOComponent;
