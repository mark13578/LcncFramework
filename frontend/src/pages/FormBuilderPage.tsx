// src/pages/FormBuilderPage.tsx
import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DraggableItem from '../components/DraggableItem';
import DroppableCanvas from '../components/DroppableCanvas';
import PropertiesPanel from '../components/PropertiesPanel';
import { FieldType } from '../services/formService';
import type { CanvasField } from '../types/builder';

const PALETTE_COMPONENTS = [
  { id: 'palette-textfield', type: FieldType.TextField, label: '文字欄位' },
  { id: 'palette-numberfield', type: FieldType.NumberField, label: '數字欄位' },
  { id: 'palette-datepicker', type: FieldType.DatePicker, label: '日期選擇' },
];

const FormBuilderPage = () => {
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  const [selectedField, setSelectedField] = useState<CanvasField | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // --- 除錯日誌 ---
    // 這會在每次拖曳結束時，告訴我們拖曳了哪個元件(active)以及放置在哪裡(over)
    console.log('Drag End Event:', { activeId: active.id, overId: over?.id });

    if (!over) return;

    // 情況一：從元件面板拖曳到畫布 (新增)
    if (active.id.toString().startsWith('palette-') && over.id === 'canvas-droppable') {
      const component = PALETTE_COMPONENTS.find(c => c.id === active.id);
      
      if (component) {
        console.log('Adding new component from palette:', component.label);
        const newField: CanvasField = {
          // ↓↓ 修正點一：使用更明確的 active.id 來產生新 ID ↓↓
          id: `${active.id}-${Date.now()}`, 
          type: component.type,
          label: component.label,
        };
        setCanvasFields(prevFields => [...prevFields, newField]);
      } else {
        console.error('Could not find component in palette for id:', active.id);
      }
      return;
    }

    // 情況二：在畫布內拖曳排序
    const activeId = active.id.toString();
    const overId = over.id.toString();
    const isDraggingCanvasItem = canvasFields.some(f => f.id === activeId);
    const isOverCanvasItem = canvasFields.some(f => f.id === overId);

    if (isDraggingCanvasItem && isOverCanvasItem && activeId !== overId) {
        console.log(`Reordering item ${activeId} over ${overId}`);
        const activeIndex = canvasFields.findIndex(f => f.id === activeId);
        const overIndex = canvasFields.findIndex(f => f.id === overId);
        setCanvasFields((fields) => arrayMove(fields, activeIndex, overIndex));
    }
  };

  const handleUpdateField = (updatedField: CanvasField) => {
    setCanvasFields(prevFields => 
      prevFields.map(field => 
        field.id === updatedField.id ? updatedField : field
      )
    );
    setSelectedField(updatedField);
  };

  const handleSelectField = (id: string | null) => {
    if (id === null) {
      setSelectedField(null);
      return;
    }
    const field = canvasFields.find(f => f.id === id);
    setSelectedField(field || null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} sensors={sensors}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
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
        <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#f5f5f5' }} onClick={() => handleSelectField(null)}>
          <Typography variant="h6" gutterBottom>我的表單</Typography>
          <DroppableCanvas 
            fields={canvasFields}
            selectedFieldId={selectedField?.id || null}
            onSelectField={handleSelectField}
          />
        </Box>
        <Paper sx={{ width: 300, p: 2, overflowY: 'auto' }} elevation={2}>
           <PropertiesPanel 
            selectedField={selectedField}
            onUpdateField={handleUpdateField}
          />
        </Paper>
      </Box>
    </DndContext>
  );
};

export default FormBuilderPage;