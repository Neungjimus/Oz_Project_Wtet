import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

const Appq = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default Appq;
