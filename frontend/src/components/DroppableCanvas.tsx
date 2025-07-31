// src/components/DroppableCanvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Typography, Box } from '@mui/material';
import SortableItem from './SortableItem';

// 沿用 Page 中的型別定義
interface CanvasField {
  id: string;
  label: string;
}

interface DroppableCanvasProps {
  fields: CanvasField[];
}

const DroppableCanvas = ({ fields }: DroppableCanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable', // 這個 ID 必須與 handleDragEnd 中檢查的 ID 一致
  });

  return (
    <Paper 
      ref={setNodeRef} // 將這個 DOM 節點註冊為可放置區域
      sx={{ minHeight: '100%', p: 2, border: '2px dashed #ccc' }}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="textSecondary">請從左側拖曳元件到此處</Typography>
          </Box>
        ) : (
          fields.map(field => (
            <SortableItem key={field.id} id={field.id}>
              <Box sx={{ p: 2, border: '1px solid #ccc', mb: 1, backgroundColor: 'white', cursor: 'grab' }}>
                {field.label}
              </Box>
            </SortableItem>
          ))
        )}
      </SortableContext>
    </Paper>
  );
};

export default DroppableCanvas;