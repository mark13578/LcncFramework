// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import userService from '../services/userService';
import authService from '../services/authService';

interface UserProfile {
  username: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getMyProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // 如果 token 失效等原因導致請求失敗，也應導向登入頁
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <CircularProgress />; // 載入中，顯示一個轉圈圈的動畫
  }

  return (
    <Box>
      <Typography variant="h4">
        主控台
      </Typography>
      {user && <Typography variant="h6">歡迎您，{user.username}！</Typography>}
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
        登出
      </Button>
    </Box>
  );
};

export default DashboardPage;