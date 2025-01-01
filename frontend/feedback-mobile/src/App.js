import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import CompletionPage from "./pages/CompletionPage";

import ErrorPage from "./pages/ErrorPage";
import TopNav from "./components/TopNav";
import RootPage from "./pages/RootPage";

function App() {
  return (
    <BookingProvider>
      <div className="App">
        <BrowserRouter>
          <TopNav />
          <Routes>
            <Route path="/" element={<ErrorPage />} />
            <Route path="/:bookingId" element={<RootPage />} />
            <Route path="/complete" element={<CompletionPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </BookingProvider>
  );
}

export default App;
