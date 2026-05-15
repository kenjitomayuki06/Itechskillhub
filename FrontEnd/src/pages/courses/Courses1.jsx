import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/courses/Courses1.css";
import coursesData from "./coursesData";

const Courses1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cards = document.querySelectorAll(".course-box");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleStartLearning = (courseId) => {
    // Navigate based on course ID
    if (courseId === 1) {
      navigate("/course/css-ncii");
    } else if (courseId === 2) {
      navigate("/course/pc-hardware");
    } else if (courseId === 3) {
      navigate("/course/network-setup");
    } else if (courseId === 4) {
      navigate("/course/os-installation");
    }
    // Add more navigation logic for other courses here
  };

  return (
    <section className="courses-section">
      <div className="courses-header">
        <h2>Available Courses</h2>
        <p>
          Choose from our selection of TESDA-aligned courses designed to give you
          job-ready skills in Computer Systems Servicing.
        </p>
      </div>

      <div className="courses-grid">
        {coursesData.map((course) => (
          <div className="course-box" key={course.id}>
            {/* IMAGE */}
            <div className="course-image">
              {course.badge && (
                <span className="course-badge">{course.badge}</span>
              )}

              <img src={course.image} alt={course.title} />

              <div className="course-meta">
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M339.5-108.5q-65.5-28.5-114-77t-77-114Q120-365 120-440t28.5-140.5q28.5-65.5 77-114t114-77Q405-800 480-800t140.5 28.5q65.5 28.5 114 77t77 114Q840-515 840-440t-28.5 140.5q-28.5 65.5-77 114t-114 77Q555-80 480-80t-140.5-28.5ZM480-440Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg> {course.hours}</span>
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg> {course.students}</span>
                <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFD700"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg> {course.rating}</span>
              </div>
            </div>

            {/* BODY */}
            <div className="course-body">
              <h3>{course.title}</h3>
              <small>{course.level}</small>

              <p>{course.description}</p>

              <div className="course-tags">
                <span className="tag-purple">{course.modules}</span>
                <span className="tag-orange">{course.lessons}</span>
                {course.free && (
                  <span className="tag-orange-soft">
                    Free for Students
                  </span>
                )}
              </div>

              <div className="course-footer">
                <span className="free-access">Free Access</span>
                <button 
                  className="course-btn"
                  onClick={() => handleStartLearning(course.id)}
                >
                  Start Learning →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses1;