import React from "react";
interface Breadcrumb {
    url?: string;
    action?: any;
}
interface Props {
    breadcrumb: Breadcrumb;
    existingBreadcrumbs: Breadcrumb[];
    onUpdateBreadcrumb: (breadcrumbs: any[]) => void;
    onDeleteBreadcrumb: () => void;
}
declare const BreadcrumbBuilder: React.FC<Props>;
export default BreadcrumbBuilder;
