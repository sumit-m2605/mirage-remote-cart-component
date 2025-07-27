import React from "react";
interface Props {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}
declare const ConfirmationDialog: React.FC<Props>;
export default ConfirmationDialog;
