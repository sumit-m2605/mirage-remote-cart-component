import React from 'react';
import type { MetaTag } from './MetaTags';
interface Props {
    metaList: MetaTag[];
    onEdit: (meta: MetaTag, index: number) => void;
    onDelete: (meta: MetaTag, index: number) => void;
    onReorder: (list: MetaTag[]) => void;
}
declare const MetaList: React.FC<Props>;
export default MetaList;
