import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AlgorithmLayout from './components/AlgorithmLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AlgorithmLayout />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/:algorithmId" element={<AlgorithmLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
