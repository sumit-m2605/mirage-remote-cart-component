import React from "react";
interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    onDelete: () => void;
    label?: string;
    aspectRatio?: string;
    minimumResolution?: {
        width: number;
        height: number;
    };
    maximumResolution?: {
        width: number;
        height: number;
    };
    maxSize?: number;
    fileTypes?: string[];
    namespace?: string;
    fileName?: string;
    showGallery?: boolean;
    fetchGalleryImages?: (namespace: string, params: any) => Promise<any>;
    uploadImage?: (file: File) => Promise<string>;
}
declare const ImageUploader: React.FC<ImageUploaderProps>;
export default ImageUploader;
