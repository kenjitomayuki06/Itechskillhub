import React, { useState, useRef } from 'react';
import "../../../styles/courses/NSC.css";
import { courseLessons, assignmentsData, getTotalLessonsCount, courseOverview } from './courseData';

const NSC = () => {
  // Course metadata
  const courseMetadata = {
    totalStudents: 1800,
    averageRating: 4.8,
    totalRatings: 0,
  };

  // State management
  const [modules, setModules] = useState(courseLessons.modules);
  const [currentLesson, setCurrentLesson] = useState(modules[0].lessons[0]);
  const [expandedModules, setExpandedModules] = useState([1]);
  const [assignments, setAssignments] = useState(assignmentsData);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [activeTab, setActiveTab] = useState('modules');
  const videoRef = useRef(null);

  // Get assignments for current lesson
  const getCurrentLessonAssignments = () => {
    return assignments.filter(a => a.lessonId === currentLesson.id);
  };

  // Get module assignments
  const getCurrentModuleAssignments = () => {
    const currentModule = modules.find(m => 
      m.lessons.some(l => l.id === currentLesson.id)
    );
    return assignments.filter(a => a.moduleId === currentModule?.id);
  };

  // Get general course assignments
  const getGeneralAssignments = () => {
    return assignments.filter(a => a.type === 'general');
  };

  // Calculate progress statistics
  const calculateProgress = () => {
    const allLessons = modules.flatMap(m => m.lessons);
    const completedCount = allLessons.filter(l => l.completed).length;
    const totalCount = allLessons.length;
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    const completedDuration = allLessons
      .filter(l => l.completed)
      .reduce((total, lesson) => {
        const minutes = parseInt(lesson.duration);
        return total + minutes;
      }, 0);
    
    const hours = Math.floor(completedDuration / 60);
    const mins = completedDuration % 60;
    
    return {
      completedCount,
      totalCount,
      percentage,
      duration: `${hours}h ${mins}min`
    };
  };

  const progress = calculateProgress();

  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Mark lesson as complete
  const markLessonComplete = (lessonId) => {
    setModules(prevModules => 
      prevModules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      }))
    );

    if (currentLesson.id === lessonId) {
      setCurrentLesson(prev => ({ ...prev, completed: true }));
    }
  };

  // Change current lesson
  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
  };

  // Open assignment modal
  const openAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
    setSubmissionText('');
    setSubmissionFile(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionFile(e.target.files[0]);
    }
  };

  // Submit assignment
  const submitAssignment = () => {
    if (!selectedAssignment) return;

    const submission = {
      submittedAt: new Date().toISOString(),
      type: selectedAssignment.submissionType,
      content: selectedAssignment.submissionType === 'text' ? submissionText : null,
      file: selectedAssignment.submissionType === 'file' ? submissionFile : null,
    };

    setAssignments(prev => 
      prev.map(a => 
        a.id === selectedAssignment.id 
          ? { ...a, status: 'submitted', studentSubmission: submission }
          : a
      )
    );

    setShowAssignmentModal(false);
    alert('Assignment submitted successfully!');
  };

  // Submit rating
  const submitRating = () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setHasRated(true);
    setShowRatingModal(false);
    alert(`Thank you for rating this course ${userRating} stars!`);
    
    setUserRating(0);
    setRatingComment('');
  };

  // Calculate module completion percentage
  const getModuleCompletion = (module) => {
    const completed = module.lessons.filter(l => l.completed).length;
    const total = module.lessons.length;
    return Math.round((completed / total) * 100);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'submitted': return '#3b82f6';
      case 'graded': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="course-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <a href="/course" className="breadcrumb-link">Courses</a>
        <span className="breadcrumb-separator"> › </span>
        <span className="breadcrumb-current">Network Setup & Configuration</span>
      </nav>

      <div className="course-layout">
        {/* Title and Progress Side by Side */}
        <div className="title-progress-container">
          <div className="title-section">
            <h1 className="course-title">Network Setup &</h1>
            <h1 className="course-title">Configuration</h1>
            <p className="course-description">
              Learn to set up LANs, configure routers, and troubleshoot common network issues. Master network 
              fundamentals, cable installation, and real-world networking scenarios valued by IT employers.
            </p>
            
            {/* Course Stats */}
            <div className="course-stats">
              <div className="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{courseOverview.duration}</span>
              </div>
              <div className="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>0 students</span>
              </div>
              <div className="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>No ratings yet</span>
              </div>
              <div className="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span>{getTotalLessonsCount()} lessons</span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-card">
              <h3 className="progress-heading">Your Progress</h3>
              
              <div className="completion-block">
                <div className="completion-header">
                  <span className="completion-label">Course Completion</span>
                  <span className="completion-percent">{progress.percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress.percentage}%` }}></div>
                </div>
              </div>

              <div className="progress-stats">
                <div className="progress-stat">
                  <span className="stat-emoji"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#262c4a"><path d="M400-400h160v-80H400v80Zm0-120h320v-80H400v80Zm0-120h320v-80H400v80Zm-80 400q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg></span>
                  <div className="stat-info">
                    <div className="stat-value">{progress.completedCount}/{progress.totalCount}</div>
                    <div className="stat-label">Lessons Done</div>
                  </div>
                </div>

                <div className="progress-stat">
                  <span className="stat-emoji"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#262c4a"><path d="M339.5-108.5q-65.5-28.5-114-77t-77-114Q120-365 120-440t28.5-140.5q28.5-65.5 77-114t114-77Q405-800 480-800t140.5 28.5q65.5 28.5 114 77t77 114Q840-515 840-440t-28.5 140.5q-28.5 65.5-77 114t-114 77Q555-80 480-80t-140.5-28.5ZM480-440Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg></span>
                  <div className="stat-info">
                    <div className="stat-value">{progress.duration}</div>
                    <div className="stat-label">Time Spent</div>
                  </div>
                </div>

                <div className="progress-stat">
                  <span className="stat-emoji"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#262c4a"><path d="M295-119q-36-1-68.5-18.5T165-189q-40-48-62.5-114.5T80-440q0-83 31.5-156T197-723q54-54 127-85.5T480-840q83 0 156 32t127 87q54 55 85.5 129T880-433q0 77-25 144t-71 113q-28 28-59 42.5T662-119q-18 0-36-4.5T590-137l-56-28q-12-6-25.5-9t-28.5-3q-15 0-28.5 3t-25.5 9l-56 28q-19 10-37.5 14.5T295-119Zm2-80q9 0 18.5-2t18.5-7l56-28q21-11 43.5-16t45.5-5q23 0 46 5t44 16l57 28q9 5 18 7t18 2q19 0 36-10t34-30q32-38 50-91t18-109q0-134-93-227.5T480-760q-134 0-227 94t-93 228q0 57 18.5 111t51.5 91q17 20 33 28.5t34 8.5Zm183-281Zm56.5 96.5Q560-407 560-440q0-8-1.5-16t-4.5-16l50-67q10 13 17.5 27.5T634-480h82q-15-88-81.5-144T480-680q-88 0-155 56.5T244-480h82q14-54 57-87t97-33q17 0 32 3t29 9l-51 69q-2 0-5-.5t-5-.5q-33 0-56.5 23.5T400-440q0 33 23.5 56.5T480-360q33 0 56.5-23.5Z"/></svg></span>
                  <div className="stat-info">
                    <div className="stat-value">{modules.length}</div>
                    <div className="stat-label">Modules</div>
                  </div>
                </div>

                <div className="progress-stat">
                  <span className="stat-emoji"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#262c4a"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg></span>
                  <div className="stat-info">
                    <div className="stat-value">{hasRated ? userRating : '-'}</div>
                    <div className="stat-label">Your Rating</div>
                  </div>
                </div>
              </div>

              {/* Rate Course Button */}
              <button 
                className="rate-course-btn"
                onClick={() => setShowRatingModal(true)}
                disabled={hasRated}
              >
                {hasRated ? '✓ Rated' : '⭐ Rate this Course'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Section */}
      <div className="lesson-section">
        <div className="lesson-tabs">
          <button 
            className={`lesson-tab ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            Learn
          </button>
          <button 
            className={`lesson-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`lesson-tab ${activeTab === 'certificate' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificate')}
          >
            Certificate
          </button>
        </div>

        <div className="lesson-content-wrapper">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <h2 className="overview-heading">Course Overview</h2>
              
              <div className="overview-section">
                <h3>About This Course</h3>
                <p>{courseOverview.description}</p>
              </div>

              <div className="overview-grid">
                <div className="overview-section">
                  <h3>What You'll Learn</h3>
                  <ul className="learning-outcomes">
                    {courseOverview.whatYouWillLearn.map((item, index) => (
                      <li key={index}>
                        <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="overview-section">
                  <h3>Prerequisites</h3>
                  <ul className="prerequisites-list">
                    {courseOverview.prerequisites.map((item, index) => (
                      <li key={index}>
                        <svg className="dot-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="#3b82f6">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="overview-section">
                <h3>Course Details</h3>
                <div className="course-details-grid">
                  <div className="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff8c1a" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <strong>Duration</strong>
                      <p>{courseOverview.duration}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <div>
                      <strong>Level</strong>
                      <p>{courseOverview.level}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    <div>
                      <strong>Modules</strong>
                      <p>{courseLessons.modules.length} modules, {getTotalLessonsCount()} lessons</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <h3>Instructor</h3>
                <div className="instructor-card">
                  <div className="instructor-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="instructor-info">
                    <h4>{courseOverview.instructor.name}</h4>
                    <p>{courseOverview.instructor.bio}</p>
                    <p className="instructor-experience">{courseOverview.instructor.experience}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <>
              {/* Left - Video and Lesson Info */}
              <div className="lesson-main">
                {/* Video Player */}
                <div className="video-container">
                  <iframe
                    ref={videoRef}
                    key={currentLesson.id}
                    width="100%"
                    height="100%"
                    src={`${currentLesson.videoUrl}?enablejsapi=1`}
                    title={currentLesson.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Lesson Info */}
                <div className="lesson-info">
                  <h2 className="lesson-title">{currentLesson.name}</h2>
                  <p className="lesson-description">{currentLesson.description}</p>
                  <p className="lesson-duration">Duration: {currentLesson.duration}</p>
                  
                  {/* Action Buttons */}
                  <div className="lesson-actions">
                    {currentLesson.completed ? (
                      <button className="completed-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Completed
                      </button>
                    ) : (
                      <button 
                        className="mark-complete-btn"
                        onClick={() => markLessonComplete(currentLesson.id)}
                      >
                        Mark as Complete
                      </button>
                    )}

                    {currentLesson.pdfUrl ? (
                      <a 
                        href={currentLesson.pdfUrl} 
                        className="download-pdf-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PDF
                      </a>
                    ) : (
                      <button className="download-pdf-btn disabled" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        No PDF Available
                      </button>
                    )}
                  </div>
                </div>

                {/* Assignments Section */}
                {(getCurrentLessonAssignments().length > 0 || getCurrentModuleAssignments().length > 0) && (
                  <div className="assignments-section">
                    <h3 className="assignments-heading">Assignments</h3>
                    
                    {getCurrentLessonAssignments().length > 0 && (
                      <div className="assignments-group">
                        <h4 className="assignment-group-title">Lesson Assignments</h4>
                        {getCurrentLessonAssignments().map((assignment) => (
                          <div key={assignment.id} className="assignment-card">
                            <div className="assignment-header">
                              <h4 className="assignment-title">{assignment.title}</h4>
                              <span 
                                className="assignment-status-badge"
                                style={{ backgroundColor: getStatusColor(assignment.status) }}
                              >
                                {assignment.status}
                              </span>
                            </div>
                            <p className="assignment-description">{assignment.description}</p>
                            <div className="assignment-meta">
                              <span className="assignment-due">Due: {formatDate(assignment.dueDate)}</span>
                              <span className="assignment-points">{assignment.points} points</span>
                            </div>
                            {assignment.status === 'graded' && (
                              <div className="assignment-grade">
                                <strong>Grade:</strong> {assignment.grade}/{assignment.points}
                                {assignment.feedback && <p className="assignment-feedback">{assignment.feedback}</p>}
                              </div>
                            )}
                            <button 
                              className="view-assignment-btn"
                              onClick={() => openAssignment(assignment)}
                            >
                              {assignment.status === 'pending' ? 'Submit Assignment' : 'View Submission'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {getCurrentModuleAssignments().length > 0 && (
                      <div className="assignments-group">
                        <h4 className="assignment-group-title">Module Assignments</h4>
                        {getCurrentModuleAssignments().map((assignment) => (
                          <div key={assignment.id} className="assignment-card">
                            <div className="assignment-header">
                              <h4 className="assignment-title">
                                <span className="module-badge">Module</span>
                                {assignment.title}
                              </h4>
                              <span 
                                className="assignment-status-badge"
                                style={{ backgroundColor: getStatusColor(assignment.status) }}
                              >
                                {assignment.status}
                              </span>
                            </div>
                            <p className="assignment-description">{assignment.description}</p>
                            <div className="assignment-meta">
                              <span className="assignment-due">Due: {formatDate(assignment.dueDate)}</span>
                              <span className="assignment-points">{assignment.points} points</span>
                            </div>
                            {assignment.status === 'graded' && (
                              <div className="assignment-grade">
                                <strong>Grade:</strong> {assignment.grade}/{assignment.points}
                                {assignment.feedback && <p className="assignment-feedback">{assignment.feedback}</p>}
                              </div>
                            )}
                            <button 
                              className="view-assignment-btn"
                              onClick={() => openAssignment(assignment)}
                            >
                              {assignment.status === 'pending' ? 'Submit Assignment' : 'View Submission'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'certificate' && (
            <div className="certificate-content-full">
              <h2 className="certificate-heading">Certificate of Completion</h2>
              
              <div className="certificate-info-grid">
                <div className="certificate-section">
                  <h3>Course Certification</h3>
                  <p className="certificate-lead">{courseOverview.certification.name}</p>
                  <p>Upon successful completion of this course, you will receive an official certificate in PC Hardware Assembly & Troubleshooting, demonstrating your competency in computer building and repair.</p>
                </div>

                <div className="certificate-section">
                  <h3>Requirements</h3>
                  <ul className="certificate-list">
                    {courseOverview.certification.requirements.map((req, index) => (
                      <li key={index}>
                        <svg className="requirement-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4"/>
                          <path d="M12 8h.01"/>
                        </svg>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="certificate-section">
                  <h3>Benefits</h3>
                  <ul className="certificate-list">
                    {courseOverview.certification.benefits.map((benefit, index) => (
                      <li key={index}>
                        <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="certificate-progress-section">
                <h3>Your Progress</h3>
                <div className="progress-visual">
                  <div className="circular-progress">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress.percentage / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div className="progress-percentage-display">
                      <span className="percentage-number">{progress.percentage}%</span>
                      <span className="percentage-label">Complete</span>
                    </div>
                  </div>
                  <div className="progress-details">
                    <div className="progress-stat-item">
                      <span className="stat-number">{progress.completedCount}/{progress.totalCount}</span>
                      <span className="stat-text">Lessons Completed</span>
                    </div>
                    <div className="progress-stat-item">
                      <span className="stat-number">{progress.duration}</span>
                      <span className="stat-text">Time Invested</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="certificate-action-section">
                {progress.percentage === 100 ? (
                  <div className="certificate-ready">
                    <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h3>Congratulations!</h3>
                    <p>You've completed all requirements for the certificate.</p>
                    <button className="download-certificate-btn-large">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Your Certificate
                    </button>
                  </div>
                ) : (
                  <div className="certificate-locked">
                    <svg className="lock-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <h3>Keep Going!</h3>
                    <p>Complete all lessons and assignments to unlock your certificate.</p>
                    <p className="remaining-text">{progress.totalCount - progress.completedCount} lessons remaining</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right - Course Sidebar */}
          <div className="course-sidebar">
            {/* Tab Navigation */}
            <div className="sidebar-tabs">
              <button 
                className={`sidebar-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`sidebar-tab ${activeTab === 'modules' ? 'active' : ''}`}
                onClick={() => setActiveTab('modules')}
              >
                Modules
              </button>
              <button 
                className={`sidebar-tab ${activeTab === 'certificate' ? 'active' : ''}`}
                onClick={() => setActiveTab('certificate')}
              >
                Certificate
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-content">
                <h3 className="sidebar-heading">Course Overview</h3>
                
                <div className="overview-section">
                  <h4>About This Course</h4>
                  <p>{courseOverview.description}</p>
                </div>

                <div className="overview-section">
                  <h4>Prerequisites</h4>
                  <ul className="overview-list">
                    {courseOverview.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                <div className="overview-section">
                  <h4>What You'll Learn</h4>
                  <ul className="overview-list">
                    {courseOverview.whatYouWillLearn.map((item, index) => (
                      <li key={index}>
                        <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="overview-section">
                  <h4>Instructor</h4>
                  <p><strong>{courseOverview.instructor.name}</strong></p>
                  <p>{courseOverview.instructor.bio}</p>
                  <p className="instructor-experience">{courseOverview.instructor.experience}</p>
                </div>
              </div>
            )}

            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="modules-content">
                <h3 className="sidebar-heading">Course Content</h3>

                {modules.map((module) => (
                  <div key={module.id} className="module-item">
                    <div className="module-header" onClick={() => toggleModule(module.id)}>
                      <div className="module-title-wrapper">
                        <span className="module-number">{module.id}</span>
                        <div className="module-info">
                          <h4 className="module-title">{module.title}</h4>
                          <p className="module-meta">{module.lessons.length} lessons • {getModuleCompletion(module)}% complete</p>
                        </div>
                      </div>
                      <svg 
                        className="module-toggle" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ transform: expandedModules.includes(module.id) ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="module-lessons">
                        {module.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            className={`lesson-item ${lesson.completed ? 'completed' : ''} ${currentLesson.id === lesson.id ? 'active' : ''}`}
                            onClick={() => handleLessonClick(lesson)}
                          >
                            {lesson.completed ? (
                              <svg className="lesson-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                              </svg>
                            ) : (
                              <svg className="lesson-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                              </svg>
                            )}
                            <span className="lesson-name">{lesson.name}</span>
                            <span className="lesson-time">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certificate Tab */}
            {activeTab === 'certificate' && (
              <div className="certificate-content">
                <h3 className="sidebar-heading">Certificate</h3>
                
                <div className="certificate-card">
                  <svg className="certificate-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#262c4a" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M9 15l2 2 4-4"/>
                  </svg>
                  
                  <h4 className="certificate-title">{courseOverview.certification.name}</h4>
                  
                  <div className="certificate-section">
                    <h5>Requirements</h5>
                    <ul className="certificate-list">
                      {courseOverview.certification.requirements.map((req, index) => (
                        <li key={index}>
                          <svg className="requirement-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="certificate-section">
                    <h5>Benefits</h5>
                    <ul className="certificate-list">
                      {courseOverview.certification.benefits.map((benefit, index) => (
                        <li key={index}>
                          <svg className="benefit-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="certificate-progress">
                    <p className="progress-label">Your Progress</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress.percentage}%` }}></div>
                    </div>
                    <p className="progress-text">{progress.percentage}% Complete</p>
                  </div>

                  {progress.percentage === 100 ? (
                    <button className="download-certificate-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Certificate
                    </button>
                  ) : (
                    <p className="certificate-locked">Complete all requirements to unlock your certificate</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {showAssignmentModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedAssignment.title}</h3>
              <button className="modal-close" onClick={() => setShowAssignmentModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">{selectedAssignment.description}</p>
              
              <div className="modal-meta">
                <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                <span>Points: {selectedAssignment.points}</span>
              </div>

              {selectedAssignment.status === 'pending' ? (
                <div className="submission-form">
                  {selectedAssignment.submissionType === 'text' && (
                    <div className="form-group">
                      <label>Your Answer:</label>
                      <textarea 
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Type your answer here..."
                        rows="8"
                      />
                    </div>
                  )}

                  {selectedAssignment.submissionType === 'file' && (
                    <div className="form-group">
                      <label>Upload File:</label>
                      <input 
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {submissionFile && (
                        <p className="file-selected">Selected: {submissionFile.name}</p>
                      )}
                    </div>
                  )}

                  {selectedAssignment.submissionType === 'quiz' && (
                    <div className="quiz-placeholder">
                      <p>Quiz interface will be displayed here</p>
                      <p className="quiz-note">(To be implemented by instructor)</p>
                    </div>
                  )}

                  <button 
                    className="submit-btn"
                    onClick={submitAssignment}
                    disabled={
                      (selectedAssignment.submissionType === 'text' && !submissionText) ||
                      (selectedAssignment.submissionType === 'file' && !submissionFile)
                    }
                  >
                    Submit Assignment
                  </button>
                </div>
              ) : (
                <div className="submission-view">
                  <h4>Your Submission</h4>
                  <p className="submitted-date">
                    Submitted: {selectedAssignment.studentSubmission?.submittedAt 
                      ? new Date(selectedAssignment.studentSubmission.submittedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                  
                  {selectedAssignment.status === 'graded' && (
                    <div className="grade-display">
                      <h4>Grade: {selectedAssignment.grade}/{selectedAssignment.points}</h4>
                      {selectedAssignment.feedback && (
                        <div className="feedback-box">
                          <strong>Instructor Feedback:</strong>
                          <p>{selectedAssignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedAssignment.status === 'submitted' && (
                    <p className="waiting-grade">Waiting for instructor to grade...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rate this Course</h3>
              <button className="modal-close" onClick={() => setShowRatingModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">How would you rate your experience with this course?</p>
              
              {/* Star Rating */}
              <div className="star-rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="star-button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill={(hoverRating || userRating) >= star ? "#FFA726" : "none"}
                      stroke="#FFA726" 
                      strokeWidth="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>

              {userRating > 0 && (
                <p className="rating-text">You selected: {userRating} star{userRating > 1 ? 's' : ''}</p>
              )}

              {/* Comment (Optional) */}
              <div className="form-group" style={{ marginTop: '24px' }}>
                <label>Comment (Optional):</label>
                <textarea 
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  rows="4"
                />
              </div>

              <button 
                className="submit-btn"
                onClick={submitRating}
                disabled={userRating === 0}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NSC;