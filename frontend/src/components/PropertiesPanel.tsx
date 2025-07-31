// src/components/PropertiesPanel.tsx
import { Box, Typography, TextField } from '@mui/material';
import type { CanvasField } from '../types/builder'; // <-- 修正點：從新的中立檔案導入型別

interface PropertiesPanelProps {
  selectedField: CanvasField | null;
  onUpdateField: (updatedField: CanvasField) => void;
}

const PropertiesPanel = ({ selectedField, onUpdateField }: PropertiesPanelProps) => {
  if (!selectedField) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          屬性
        </Typography>
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          請選擇一個元件進行編輯
        </Typography>
      </Box>
    );
  }

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField({
      ...selectedField,
      label: event.target.value,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        屬性
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        ID: {selectedField.id}
      </Typography>
      
      <TextField
        label="欄位標籤 (Label)"
        value={selectedField.label}
        onChange={handleLabelChange}
        fullWidth
        margin="normal"
        variant="outlined"
      />
    </Box>
  );
};

export default PropertiesPanel;