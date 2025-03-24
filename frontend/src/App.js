import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LoginRoute from "./components/LoginRoute";
import DashboardRoute from "./components/DashboardRoute";
import MapRoute from "./components/MapRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login/" element={<LoginRoute />} />
        <Route element={<ProtectedRoute />}>
          <Route exact path="/dashboard" element={<DashboardRoute />} />
          <Route exact path="/map" element={<MapRoute />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
