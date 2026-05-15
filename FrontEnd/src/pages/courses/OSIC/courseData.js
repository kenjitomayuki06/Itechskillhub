// Course Data for Operating System Installation & Configuration
// Contains lesson modules and assignments

export const courseOverview = {
  title: "Operating System Installation & Configuration",
  description: "Learn to install, configure, and optimize operating systems. This comprehensive course covers Windows and Linux installation, driver management, system tweaking, and troubleshooting common OS issues.",
  duration: "50 hours",
  level: "Beginner",
  prerequisites: [
    "Basic computer literacy",
    "Understanding of computer hardware",
    "Familiarity with file systems"
  ],
  whatYouWillLearn: [
    "Install Windows and Linux operating systems",
    "Configure system settings and preferences",
    "Manage device drivers and hardware",
    "Optimize system performance",
    "Troubleshoot common OS issues",
    "Implement basic security measures"
  ],
  certification: {
    available: true,
    name: "Operating System Installation & Configuration Certificate",
    requirements: [
      "Complete all 6 lessons across 3 modules",
      "Pass all module assessments with 75% or higher",
      "Complete hands-on OS installation labs",
      "Submit system optimization project"
    ],
    benefits: [
      "Industry-recognized certification",
      "Qualification for IT support roles",
      "Enhanced troubleshooting skills",
      "Foundation for advanced system administration"
    ]
  },
  instructor: {
    name: "Certified IT Professional",
    bio: "Experienced system administrator with extensive hands-on experience in OS deployment, configuration, and maintenance.",
    experience: "10+ years in IT support and training"
  }
};

export const courseLessons = {
  modules: [
    {
      id: 1,
      title: "Windows Installation",
      lessons: [
        {
          id: 1,
          name: "Preparing for Windows Installation",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/3QhU9jd03a0",
          description: "System requirements and pre-installation checklist.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 2,
          name: "Windows Installation Walkthrough",
          duration: "25 min",
          videoUrl: "https://www.youtube.com/embed/PpsEaqJV_A0",
          description: "Step-by-step Windows installation process.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Linux Basics",
      lessons: [
        {
          id: 3,
          name: "Choosing a Linux Distribution",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/7-rTNgOCjeg",
          description: "Overview of popular Linux distributions and their use cases.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 4,
          name: "Ubuntu Installation Guide",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/lullzS740wI",
          description: "Complete guide to installing Ubuntu Linux.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Driver Management",
      lessons: [
        {
          id: 5,
          name: "Finding & Installing Drivers",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/eMamgWllRFY",
          description: "Locate and install device drivers for optimal performance.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 6,
          name: "Driver Troubleshooting",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/1i3XdhC2ZAs",
          description: "Diagnose and resolve common driver issues.",
          pdfUrl: null,
          completed: false
        }
      ]
    }
  ]
};

export const assignmentsData = [
  {
    id: 1,
    lessonId: 2,
    moduleId: null,
    type: 'lesson',
    title: "Windows Installation Report",
    description: "Document your Windows installation process with screenshots and configuration details.",
    submissionType: "file",
    dueDate: "2026-02-20",
    points: 25,
    status: "pending",
    studentSubmission: null,
    grade: null,
    feedback: null
  },
  {
    id: 2,
    lessonId: 4,
    moduleId: null,
    type: 'lesson',
    title: "Linux Installation Quiz",
    description: "Complete the quiz on Linux installation concepts and procedures.",
    submissionType: "quiz",
    dueDate: "2026-02-27",
    points: 20,
    status: "pending",
    studentSubmission: null,
    grade: null,
    feedback: null
  },
  {
    id: 3,
    lessonId: null,
    moduleId: 3,
    type: 'module',
    title: "System Optimization Project",
    description: "Optimize a system and document all drivers installed and performance improvements achieved.",
    submissionType: "file",
    dueDate: "2026-03-05",
    points: 50,
    status: "pending",
    studentSubmission: null,
    grade: null,
    feedback: null
  }
];

// Helper function to get all lessons count
export const getTotalLessonsCount = () => {
  return courseLessons.modules.reduce((total, module) => total + module.lessons.length, 0);
};

// Helper function to get lesson by ID
export const getLessonById = (lessonId) => {
  for (const module of courseLessons.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
};

// Helper function to get assignments by lesson ID
export const getAssignmentsByLessonId = (lessonId) => {
  return assignmentsData.filter(assignment => assignment.lessonId === lessonId);
};

// Helper function to get assignments by module ID
export const getAssignmentsByModuleId = (moduleId) => {
  return assignmentsData.filter(assignment => assignment.moduleId === moduleId);
};