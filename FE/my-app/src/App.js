import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/navbar/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MonitorBuilding from './components/monitor/MonitorBuilding';
import MonitorRoom from './components/monitor/MonitorRoom';
import Notifications from './components/Notifications';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className="App">
        <ToastContainer position="top-right" />
        <NavigationBar />
        <Routes>
          <Route path="/air-sensor" element={<MonitorBuilding />} />
          <Route path="/monitor-room/:officeNumber" element={<MonitorRoom/>} />
          <Route path="/" element={<Notifications />} />
        </Routes>
    </div>
  );
}

export default App;


