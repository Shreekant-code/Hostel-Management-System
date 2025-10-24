import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Signin } from "./Pages/SignIn";


import { Admindashboard } from "./Pages/Admindashboard";
import { AnalysisAdmin } from "./Pages/AnalyticsAdmin";
import { AddStudentForm } from "./Pages/StudentAdd";
import { StudentData } from "./Pages/Studnetdata";
import { UpcomingAdmin } from "./Pages/Upcomingfeature";


import { StudentDashboard } from "./Pages/Studentdashboard";
import { StudentSign } from "./Pages/Studsentsign";
import { MyProfile } from "./Pages/Myprofile";
import { UpcomingStudent } from "./Pages/UpcomingStudent";
import { Roommates } from "./Pages/Roommates";
import { Footer } from "./components/Footer";


const App = () => {
  return (
    <Router>
      <Routes>
       
      <Route
  path="/"
  element={
    <>
      <Home />
      <Footer />
    </>
  }
/>

       
        <Route path="/adminSignin" element={<Signin />} />
        <Route path="/studentSignin" element={<StudentSign />} />

      
        <Route path="/admindashboard" element={<Admindashboard />}>
          <Route index element={<AnalysisAdmin />} />
          <Route path="rooms" element={<h1>Rooms Page</h1>} />
          <Route path="students" element={<StudentData />} />
          <Route path="add-student" element={<AddStudentForm />} />
          <Route path="upcoming-feature" element={<UpcomingAdmin />} />
        </Route>

   
        <Route path="/studentdashboard" element={<StudentDashboard />}>
          <Route index element={<MyProfile/>} />
          
          <Route path="roommates" element={<Roommates />} />
          
          <Route path="upcoming-feature" element={<UpcomingStudent />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
