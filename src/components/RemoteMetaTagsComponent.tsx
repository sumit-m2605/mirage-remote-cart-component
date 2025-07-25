import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import NovusSnackbar from "./Novus-MUI-wrappers/NovusSnackbar";
import RemotePageHeader from "./commmon/RemotePageHeader";
import MetaList from "./meta_components/MetaList.tsx";
import MetaDialog from "./meta_components/MetaDialog.tsx";
import ConfirmDialog from "./meta_components/ConfirmDialog.tsx";
import type { MetaTag } from "./meta_components/MetaTags.tsx";
import NovusButton from "./Novus-MUI-wrappers/NovusButton.tsx";
import ShimmerLoader from "./commmon/ShimmerLoader";

interface Props {
  fetchCustomMetaTags: () => Promise<MetaTag[]>;
  updateCustomMetaTags: (list: MetaTag[]) => Promise<void>;
  onCancel: () => void;
  helpSlug?: string;
  helpDocsURLs: Record<string, string>;
}

const MetaTagsRemote: React.FC<Props> = ({
  fetchCustomMetaTags,
  updateCustomMetaTags,
  onCancel,
  helpSlug,
  helpDocsURLs,
}) => {
  const [loading, setLoading] = useState(true);
  const [metaList, setMetaList] = useState<MetaTag[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    success: true,
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentMeta, setCurrentMeta] = useState<MetaTag | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomMetaTags()
      .then((list) => setMetaList(list || []))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "  Failed to load meta tags",
          success: false,
        })
      )
      .finally(() => setLoading(false));
  }, [fetchCustomMetaTags]);

  const handleSaveMeta = (meta: MetaTag) => {
    const updated = [...metaList];
    if (editIndex === null) {
      updated.push(meta);
    } else {
      updated[editIndex] = meta;
    }
    updateCustomMetaTags(updated)
      .then(() => {
        setMetaList(updated);
        setSnackbar({
          open: true,
          message: "Saved successfully",
          success: true,
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "  Failed to save meta tag",
          success: false,
        });
      });
    setEditDialogOpen(false);
    setCurrentMeta(null);
    setEditIndex(null);
  };

  const handleDeleteMeta = () => {
    if (editIndex === null) return;
    const updated = [...metaList];
    updated.splice(editIndex, 1);
    updateCustomMetaTags(updated)
      .then(() => {
        setMetaList(updated);
        setSnackbar({
          open: true,
          message: "Deleted successfully",
          success: true,
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "  Failed to delete meta tag",
          success: false,
        });
      });
    setConfirmDialogOpen(false);
    setEditIndex(null);
    setCurrentMeta(null);
  };

  const handleDragEnd = (updated: MetaTag[]) => {
    setMetaList(updated);
    updateCustomMetaTags(updated).catch(() => {
      setSnackbar({
        open: true,
        message: "  Failed to reorder meta tags",
        success: false,
      });
    });
  };

  const openCreateDialog = () => {
    setCurrentMeta({ name: "", content: "" });
    setEditIndex(null);
    setEditDialogOpen(true);
  };

  const openEditDialog = (meta: MetaTag, index: number) => {
    setCurrentMeta(meta);
    setEditIndex(index);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (meta: MetaTag, index: number) => {
    setCurrentMeta(meta);
    setEditIndex(index);
    setConfirmDialogOpen(true);
  };

  return (
    <Box
      className="page-container integration-container"
      display="flex"
      flexDirection="column"
      bgcolor={"#F5F5F5"}
    >
      <RemotePageHeader
        title="Custom Meta Tags"
        onBack={onCancel}
        helpSlug={helpSlug}
        helpDocsURLs={helpDocsURLs}
        renderActions={
          <NovusButton
            variantType="primary"
            novusSize="sm"
            onClick={openCreateDialog}
          >
            Add Meta Tag
          </NovusButton>
        }
      />

      <Box
        bgcolor={"#FFFFFF"}
        borderRadius={"12px"}
        border={"1px solid #FAFAFA"}
        height={"fit-content"}
        margin={'24px'}
        flex={{ xs: "1 1 100%", md: "1 1 100%" }}
      >
        {loading ? (
          <ShimmerLoader height="200px" />
        ) : metaList.length === 0 ? (
          <Box
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            minHeight="200px"
          >
            <img
              src="/public/admin/assets/admin/svgs/no_search_result_found.svg"
              alt="No Results"
            />
            No Custom Meta Tags
          </Box>
        ) : (
          <MetaList
            metaList={metaList}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onReorder={handleDragEnd}
          />
        )}
      </Box>

      <MetaDialog
        open={editDialogOpen}
        meta={currentMeta}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveMeta}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteMeta}
      />

      <NovusSnackbar
        open={snackbar.open}
        severity={snackbar.success ? "success" : "error"}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        closable={false}
      />
    </Box>
  );
};

export default MetaTagsRemote;
