import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Signin } from "./Pages/SignIn";
import { Admindashboard } from "./Pages/Admindashboard";

// Admin sub-pages
// import DashboardHome from "./Pages/Admin/DashboardHome";
// import Rooms from "./Pages/Admin/Rooms";
// import Students from "./Pages/Admin/Students";
// import AddStudent from "./Pages/Admin/AddStudent";
// import Settings from "./Pages/Admin/Settings";

const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Home />} />
        <Route path="/adminSignin" element={<Signin />} />
        <Route path="/studentSignin" element={<Signin />} />

        
        <Route path="/admindashboard" element={<Admindashboard />}>
          <Route index element={<h1>admin dashborard</h1>} /> 
          <Route path="rooms" element={<h1>rooms page</h1>} />
          <Route path="students" element={<h2> studnets detail</h2>} />
          <Route path="add-student" element={<h1>add studnet</h1>} />
      
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

