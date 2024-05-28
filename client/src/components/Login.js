import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaQuery, Box } from '@mui/material';
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
import { SERVER_BASE_URL } from '../utils/globals';
import Logo from '../../public/logo270.png';

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
      const url = SERVER_BASE_URL + 'auth/login';
      const response = await axios.post(url, {
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

  /* // in <Toolbar> we removed this and replaced it with the img
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {appName}
        </Typography>
  */

  return (
    <AppBar
      sx={{ bgcolor: 'white', color: 'black', padding: '10px' }}
      position="static"
    >
      <Toolbar>
        <Box
          component="img"
          sx={{
            height: 64,
            marginRight: 4,
          }}
          alt={appName}
          src={Logo}
        />
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 900 }}>
          {appName}
        </Typography>
        {useMediaQuery('(max-width:960px)') ? (
          <LanguageSelect onChange={changeLanguage} />
        ) : (
          <>
            {!user.isLoggedIn ? (
              <>
                <TextField
                  label={t('Username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputLabelProps={{
                    style: { color: '#555' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#35a455',
                      },
                      '&:hover fieldset': {
                        borderColor: '#35a455', // Apply border color on hover
                      },
                      '& input': {
                        '&:autofill': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                        '&:autofill:focus': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                        '&:autofill:hover': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                      },
                    },
                  }}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{
                    style: { color: '#555' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#35a455',
                      },
                      '&:hover fieldset': {
                        borderColor: '#35a455', // Apply border color on hover
                      },
                      '& input': {
                        '&:autofill': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                        '&:autofill:focus': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                        '&:autofill:hover': {
                          WebkitBoxShadow: '0 0 0 100px white inset',
                          WebkitTextFillColor: '#000', // Change text color if needed
                        },
                      },
                    },
                  }}
                />
                <Button
                  color="inherit"
                  onClick={handleLogin}
                  style={{
                    backgroundColor: '#35a455',
                    color: 'white',
                    padding: '3px',
                    marginLeft: '10px',
                  }}
                >
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
                  <AccountCircle style={{ color: '#35a455' }} />
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
                  <MenuItem onClick={handleGoToTasks}>
                    {t('Task manager')}
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick}>{t('Logout')}</MenuItem>
                </Menu>
              </div>
            )}
            <LanguageSelect onChange={changeLanguage} />
          </>
        )}
      </Toolbar>
      {useMediaQuery('(max-width:960px)') ? (
        <>
          {!user.isLoggedIn ? (
            <>
              <div style={{ marginTop: '10px' }}>&nbsp;</div>
              <TextField
                label={t('Username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                  style: { color: '#555' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#35a455',
                    },
                    '&:hover fieldset': {
                      borderColor: '#35a455', // Apply border color on hover
                    },
                    '& input': {
                      '&:autofill': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                      '&:autofill:focus': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                      '&:autofill:hover': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#555' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#35a455',
                    },
                    '&:hover fieldset': {
                      borderColor: '#35a455', // Apply border color on hover
                    },
                    '& input': {
                      '&:autofill': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                      '&:autofill:focus': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                      '&:autofill:hover': {
                        WebkitBoxShadow: '0 0 0 100px white inset',
                        WebkitTextFillColor: '#000', // Change text color if needed
                      },
                    },
                  },
                }}
              />
              <Button
                color="inherit"
                onClick={handleLogin}
                style={{
                  backgroundColor: '#35a455',
                  color: 'white',
                  padding: '3px',
                }}
              >
                Login
              </Button>
              <div style={{ marginTop: '0px' }}>&nbsp;</div>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
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
                <AccountCircle style={{ color: '#35a455' }} />
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
                <MenuItem onClick={handleGoToTasks}>
                  {t('Task manager')}
                </MenuItem>
                <MenuItem onClick={handleLogoutClick}>{t('Logout')}</MenuItem>
              </Menu>
            </div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </AppBar>
  );
}

export default Login;
