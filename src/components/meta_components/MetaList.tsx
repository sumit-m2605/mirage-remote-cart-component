// src/components/meta-tags/MetaList.tsx
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';
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
    <Box p={'24px'} display="flex" flexDirection="column" gap={2}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="meta-tags">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {metaList.map((meta, index) => (
                <Draggable key={index} draggableId={`meta-${index}`} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '12px',
                        gap: '12px',
                        alignSelf: 'stretch',
                        borderRadius: '8px',
                        border: '1px solid #E0E0E0',
                        background: '#FAFAFA',
                        boxShadow: 'none'
                      }}
                    >
                      <Box {...provided.dragHandleProps} pr={2}>
                        <DragHandleIcon />
                      </Box>
                      <Box flex={1}>
                        <Typography fontWeight={500} fontSize={'16px'} color={'#141414'}>{meta.name}</Typography>
                        <Typography fontWeight={400} fontSize={'11px'} color={'#888888'}>{meta.content}</Typography>
                      </Box>
                      <Box display="flex" gap={2}>
                        <IconButton sx={{height: '16px', width: '16px'}} onClick={() => onEdit(meta, index)}><EditIcon  sx={{height: '16px', width: '16px'}} /></IconButton>
                        <IconButton sx={{height: '16px', width: '16px'}} onClick={() => onDelete(meta, index)}><DeleteIcon sx={{height: '16px', width: '16px'}} /></IconButton>
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
