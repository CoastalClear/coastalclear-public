import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AttendancePage from "./AttendancePage";
import TopNav from "./components/TopNav";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopNav />
        <Routes>
          {/* <Route path="/" element={<ErrorPage />} /> */}
          <Route path="/:bookingId" element={<AttendancePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
