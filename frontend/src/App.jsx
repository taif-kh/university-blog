import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorPage from './assets/ErrorPage';
import HomeActual from './HomeActual';
import DashboardActual from './DashboardActual';
import EditPost from './EditPost';
import PostDetailsActual from './PostDetailsActual';
import ShowMore from './ShowMore';



 
const App = () => {
   return (
      <>
         <Routes>
            <Route path="/" element={<HomeActual />} />
            <Route path="/showMore" element={<ShowMore />} />

            <Route path="/dashboard" element={<DashboardActual />}  /> 
            {/* --------------   */}
            <Route path="/edit/:postId" element={<EditPost />} />
            <Route path="/:postId" element={<PostDetailsActual />} />
                        {/* --------------   */}  
            <Route path="/error" element={<ErrorPage />} />
         </Routes>
      </>
   );
};
 
export default App;