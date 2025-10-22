import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Signin } from "./Pages/SignIn";
import { Admindashboard } from "./Pages/Admindashboard";
import { AnalysisAdmin } from "./Pages/AnalyticsAdmin";
import { AddStudentForm } from "./Pages/StudentAdd";
import { StudentData } from "./Pages/Studnetdata";


const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route
  path="/"
  element={
    <>
      <Home />
   
    </>
  }
/>

        <Route path="/adminSignin" element={<Signin />} />
        <Route path="/studentSignin" element={<Signin />} />

        
        <Route path="/admindashboard" element={<Admindashboard />}>
          <Route index element={<AnalysisAdmin />} /> 
          <Route path="rooms" element={<h1>rooms page</h1>} />
          <Route path="students" element={<StudentData />} />
          <Route path="add-student" element={<AddStudentForm />} />
      
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

