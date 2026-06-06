import { Routes, Route } from "react-router-dom";
import CourseHero from "./CourseHero";
import Courses1 from "./Courses1"; 
import Courses2 from './Courses2';
import CourseCSSNCII from './courseCSSNCII/CourseCSSNCII';
import PChardwareAT from './PChardwareAT/PChardwareAT';
import NSC from "./NSC/NSC";
import OSIC from "./OSIC/OSIC";

const Course = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <CourseHero />
            <Courses1 />
            <Courses2 />
          </>
        } />
        <Route path="/css-ncii" element={<CourseCSSNCII />} />
        <Route path="/pc-hardware" element={<PChardwareAT />} />
        <Route path="/network-setup" element={<NSC />} />
        <Route path="/os-installation" element={<OSIC />} />
      </Routes>
    </>
  );
};

export default Course;