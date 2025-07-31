// src/components/DroppableCanvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Typography, Box } from '@mui/material';
import SortableItem from './SortableItem';

interface CanvasField {
  id: string;
  label: string;
}

interface DroppableCanvasProps {
  fields: CanvasField[];
  selectedFieldId: string | null; // 新增：接收選中的 ID
  onSelectField: (id: string) => void; // 新增：接收點擊處理函式
}

const DroppableCanvas = ({ fields, selectedFieldId, onSelectField }: DroppableCanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <Paper 
      ref={setNodeRef}
      sx={{ minHeight: '100%', p: 2, border: '2px dashed #ccc' }}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="textSecondary">請從左側拖曳元件到此處</Typography>
          </Box>
        ) : (
          fields.map(field => (
            // 將 SortableItem 包在一個 div 中以附加 onClick 事件
            <div key={field.id} onClick={() => onSelectField(field.id)}>
              <SortableItem id={field.id}>
                <Box sx={{ 
                  p: 2, 
                  border: field.id === selectedFieldId ? '2px solid #1976d2' : '1px solid #ccc', // 判斷是否選中，顯示不同樣式
                  mb: 1, 
                  backgroundColor: 'white', 
                  cursor: 'grab' 
                }}>
                  {field.label}
                </Box>
              </SortableItem>
            </div>
          ))
        )}
      </SortableContext>
    </Paper>
  );
};

export default DroppableCanvas;