import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import i18n from 'i18next';
import LanguageSelect from './LanguageSelect';
import { useTranslation } from 'react-i18next';

function Login() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    // Update local login state based on global user context
    if (user.isLoggedIn) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });

      console.log('handleLogin() response.data: ', response.data);

      setUser({
        ...user,
        isLoggedIn: true,
        username: username,
        role: response.data.role, // Set the user's role
      });
    } catch (error) {
      console.error('Login failed', error.response);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    logout();
    setAnchorEl(null);
  };

  const handleGoToTasks = () => {
    navigate('/tasks');
    setAnchorEl(null);
  };

  const appName = process.env.REACT_APP_NAME
    ? process.env.REACT_APP_NAME
    : 'SEM';

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {appName}
        </Typography>
        {!user.isLoggedIn ? (
          <>
            <TextField
              label={t('Username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          </>
        ) : (
          <div>
            <Typography variant="subtitle1" style={{ display: 'inline' }}>
              {t('Logged in as ')} {user.username}
            </Typography>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleGoToTasks}>{t('Task manager')}</MenuItem>
              <MenuItem onClick={handleLogoutClick}>{t('Logout')}</MenuItem>
            </Menu>
          </div>
        )}
        {/* <select onChange={(e) => changeLanguage(e.target.value)}>
          <option value="it">Italiano</option>
          <option value="en">English</option>
        </select> */}
        <LanguageSelect onChange={changeLanguage} />
      </Toolbar>
    </AppBar>
  );
}

export default Login;
