import React from "react";
interface Props {
    canonicalUrlPath: string;
    canonicalUrlDomain: string;
    onUpdateCanonicalUrlPath: (data: {
        canonical_url: string;
    }) => void;
}
declare const CanonicalUrlBuilder: React.FC<Props>;
export default CanonicalUrlBuilder;
