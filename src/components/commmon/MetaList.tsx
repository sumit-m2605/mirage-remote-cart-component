// src/components/meta-tags/MetaList.tsx
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { MetaTag } from './MetaTags';

interface Props {
  metaList: MetaTag[];
  onEdit: (meta: MetaTag, index: number) => void;
  onDelete: (meta: MetaTag, index: number) => void;
  onReorder: (list: MetaTag[]) => void;
}

const MetaList: React.FC<Props> = ({ metaList, onEdit, onDelete, onReorder }) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(metaList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onReorder(items);
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="meta-tags">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {metaList.map((meta, index) => (
                <Draggable key={index} draggableId={`meta-${index}`} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1 }}
                    >
                      <Box {...provided.dragHandleProps} pr={2}>
                        <DragIndicatorIcon />
                      </Box>
                      <Box flex={1}>
                        <Typography fontWeight={600}>{meta.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{meta.content}</Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <IconButton onClick={() => onEdit(meta, index)}><EditIcon /></IconButton>
                        <IconButton onClick={() => onDelete(meta, index)}><DeleteIcon /></IconButton>
                      </Box>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default MetaList;
