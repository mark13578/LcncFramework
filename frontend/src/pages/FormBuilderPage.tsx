// src/pages/FormBuilderPage.tsx
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DraggableItem from '../components/DraggableItem';
import DroppableCanvas from '../components/DroppableCanvas'; // <-- 引用新的 Canvas 元件
import { FieldType } from '../services/formService';

// 畫布上的欄位物件結構
interface CanvasField {
  id: string;
  type: FieldType;
  label: string;
}

// 元件面板提供的元件類型
const PALETTE_COMPONENTS = [
  { id: 'textfield', type: FieldType.TextField, label: '文字欄位' },
  { id: 'numberfield', type: FieldType.NumberField, label: '數字欄位' },
  { id: 'datepicker', type: FieldType.DatePicker, label: '日期選擇' },
];

const FormBuilderPage = () => {
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // 情況一：從元件面板拖曳到畫布 (新增)
    if (PALETTE_COMPONENTS.some(c => c.id === active.id) && over.id === 'canvas-droppable') {
      const componentType = active.id as string;
      const component = PALETTE_COMPONENTS.find(c => c.id === componentType);
      
      if (component) {
        const newField: CanvasField = {
          id: `${component.id}-${Date.now()}`,
          type: component.type,
          label: component.label,
        };
        setCanvasFields(prevFields => [...prevFields, newField]);
      }
      return;
    }

    // 情況二：在畫布內拖曳排序
    const activeId = active.id.toString();
    const overId = over.id.toString();

    // 確保拖曳的是畫布內的元件
    if (canvasFields.some(f => f.id === activeId) && canvasFields.some(f => f.id === overId)) {
        if (activeId !== overId) {
            const activeIndex = canvasFields.findIndex(f => f.id === activeId);
            const overIndex = canvasFields.findIndex(f => f.id === overId);
            setCanvasFields((fields) => arrayMove(fields, activeIndex, overIndex));
        }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* 元件面板 (Palette) */}
        <Paper sx={{ width: 240, p: 2, overflowY: 'auto' }} elevation={2}>
          <Typography variant="h6" gutterBottom>元件</Typography>
          <List>
            {PALETTE_COMPONENTS.map(component => (
              <DraggableItem key={component.id} id={component.id}>
                <ListItem disablePadding sx={{ border: '1px dashed grey', mb: 1, cursor: 'grab' }}>
                  <ListItemButton>
                    <ListItemText primary={component.label} />
                  </ListItemButton>
                </ListItem>
              </DraggableItem>
            ))}
          </List>
        </Paper>

        {/* 畫布 (Canvas) */}
        <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>我的表單</Typography>
          {/* 使用我們新建立的 DroppableCanvas 元件 */}
          <DroppableCanvas fields={canvasFields} />
        </Box>
        
        {/* 屬性面板 (Properties) - 暫時留空 */}
        <Paper sx={{ width: 300, p: 2, overflowY: 'auto' }} elevation={2}>
          <Typography variant="h6">屬性</Typography>
        </Paper>
      </Box>
    </DndContext>
  );
};

export default FormBuilderPage;