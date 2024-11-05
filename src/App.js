import './App.css';
import Sidebar from './sidebar';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div className="App">
      <Sidebar/>
      <div className="main-content">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
