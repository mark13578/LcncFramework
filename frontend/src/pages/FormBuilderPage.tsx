// src/pages/FormBuilderPage.tsx
import { useState } from 'react';
import { DndContext,  closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DraggableItem from '../components/DraggableItem';
import DroppableCanvas from '../components/DroppableCanvas';
import { FieldType } from '../services/formService';

// 畫布上的欄位物件結構
interface CanvasField {
  id: string;
  type: FieldType;
  label: string;
}

// 元件面板提供的元件類型
// 修正點一：為面板元件的 ID 加上 'palette-' 前綴，以明確區分
const PALETTE_COMPONENTS = [
  { id: 'palette-textfield', type: FieldType.TextField, label: '文字欄位' },
  { id: 'palette-numberfield', type: FieldType.NumberField, label: '數字欄位' },
  { id: 'palette-datepicker', type: FieldType.DatePicker, label: '日期選擇' },
];

const FormBuilderPage = () => {
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  
  // 使用 sensor 來優化拖曳體驗，避免點擊事件和拖曳事件衝突
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 滑鼠需要移動 8px 才觸發拖曳
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // 情況一：從元件面板拖曳到畫布 (新增)
    // 修正點二：判斷 active.id 是否包含 'palette-' 前綴
    if (active.id.toString().startsWith('palette-') && over.id === 'canvas-droppable') {
      const componentType = active.id.toString().replace('palette-', ''); // 移除前綴
      const component = PALETTE_COMPONENTS.find(c => c.id === active.id);
      
      if (component) {
        const newField: CanvasField = {
          id: `${component.type}-${Date.now()}`, // 用 type 和時間戳產生唯一 ID
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

    // 確保拖曳物件和放置目標都在畫布內
    const isDraggingCanvasItem = canvasFields.some(f => f.id === activeId);
    const isOverCanvasItem = canvasFields.some(f => f.id === overId);

    if (isDraggingCanvasItem && isOverCanvasItem && activeId !== overId) {
        const activeIndex = canvasFields.findIndex(f => f.id === activeId);
        const overIndex = canvasFields.findIndex(f => f.id === overId);
        setCanvasFields((fields) => arrayMove(fields, activeIndex, overIndex));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} sensors={sensors}>
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