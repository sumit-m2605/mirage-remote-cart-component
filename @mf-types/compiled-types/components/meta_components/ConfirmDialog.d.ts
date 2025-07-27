import React from 'react';
interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
declare const ConfirmDialog: React.FC<Props>;
export default ConfirmDialog;
