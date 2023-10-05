import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/navbar/NavigationBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MonitorBuilding from './components/monitor/MonitorBuilding';

function App() {
  return (
    <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/air-sensor" element={<MonitorBuilding />} />
        </Routes>
    </div>
  );
}

export default App;


