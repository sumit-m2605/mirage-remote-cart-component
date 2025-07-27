import React from "react";
interface Props {
    fetchRobotsTxt: () => Promise<string>;
    saveRobotsTxt: (text: string) => Promise<void>;
    onCancel: () => void;
    helpSlug?: string;
    helpDocsURLs: Record<string, string>;
}
declare const RobotsTxtRemote: React.FC<Props>;
export default RobotsTxtRemote;
