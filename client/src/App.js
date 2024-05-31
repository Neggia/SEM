import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskManager from './components/TaskManager';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';
import ProductsView from './components/ProductsView';
import './i18n/i18n';

// TODO Add translation

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Login />
                <ProductsView />
              </>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute roles={['admin']}>
                <TaskManager />
              </PrivateRoute>
            }
          />
          <Route path="/unauth" element={<div>Unauthorized</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
