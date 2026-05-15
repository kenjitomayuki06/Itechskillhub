// Course Data for PC Hardware Assembly & Troubleshooting
// Contains lesson modules and assignments

export const courseOverview = {
  title: "PC Hardware Assembly & Troubleshooting",
  description: "Master the art of building, upgrading, and repairing computers. This comprehensive course covers component identification, proper assembly techniques, troubleshooting methodologies, and hands-on practical skills valued by IT employers.",
  duration: "80 hours",
  level: "Beginner",
  prerequisites: [
    "Basic computer literacy",
    "Interest in computer hardware",
    "No prior technical experience required"
  ],
  whatYouWillLearn: [
    "Identify and understand PC hardware components",
    "Build complete computer systems from scratch",
    "Troubleshoot common hardware failures",
    "Upgrade and replace computer components",
    "Apply proper ESD safety procedures",
    "Diagnose POST errors and beep codes"
  ],
  certification: {
    available: true,
    name: "PC Hardware Assembly & Troubleshooting Certificate",
    requirements: [
      "Complete all 8 lessons across 3 modules",
      "Pass all module assessments with 75% or higher",
      "Complete hands-on build project",
      "Submit troubleshooting case studies"
    ],
    benefits: [
      "Industry-recognized certification",
      "Qualification for PC technician roles",
      "Enhanced hardware troubleshooting skills",
      "Foundation for advanced IT certifications"
    ]
  },
  instructor: {
    name: "Certified Hardware Technician",
    bio: "Experienced PC builder and hardware specialist with extensive hands-on experience in computer assembly and repair.",
    experience: "8+ years in hardware support and training"
  }
};

export const courseLessons = {
  modules: [
    {
      id: 1,
      title: "Component Identification",
      lessons: [
        {
          id: 1,
          name: "Motherboard Anatomy",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/b2pd3Y6aBag",
          description: "Understanding motherboard components, slots, and connectors.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 2,
          name: "CPUs & Processors Explained",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/vqs_0W-MSB0",
          description: "Learn about CPU specifications, sockets, and performance factors.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 3,
          name: "Memory (RAM) Types & Selection",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/PVad0c2cljo",
          description: "Different RAM types, speeds, and capacity considerations.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Assembly Procedures",
      lessons: [
        {
          id: 4,
          name: "Preparing Your Workspace",
          duration: "10 min",
          videoUrl: "https://www.youtube.com/embed/gO8N3L_aERg",
          description: "Setting up a safe and organized workspace for PC building.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 5,
          name: "Installing the CPU & Cooler",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/5qczGR4KMnY",
          description: "Step-by-step CPU installation and cooler mounting.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 6,
          name: "Complete Build Walkthrough",
          duration: "30 min",
          videoUrl: "https://www.youtube.com/embed/BL4DCEp7blY",
          description: "Full PC assembly from start to finish.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Troubleshooting",
      lessons: [
        {
          id: 7,
          name: "POST Errors & Beep Codes",
          duration: "14 min",
          videoUrl: "https://www.youtube.com/embed/McW3ouI8M5E",
          description: "Understanding and diagnosing POST errors and beep code patterns.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 8,
          name: "Common Hardware Failures",
          duration: "16 min",
          videoUrl: "https://www.youtube.com/embed/EWu2RSONesw",
          description: "Diagnosing and resolving typical hardware problems.",
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
    lessonId: 1,
    moduleId: null,
    type: 'lesson',
    title: "Motherboard Components Quiz",
    description: "Identify and explain the function of major motherboard components.",
    submissionType: "quiz",
    dueDate: "2026-02-18",
    points: 20,
    status: "pending",
    studentSubmission: null,
    grade: null,
    feedback: null
  },
  {
    id: 2,
    lessonId: 6,
    moduleId: null,
    type: 'lesson',
    title: "PC Build Documentation",
    description: "Document your PC assembly process with detailed photos and component list.",
    submissionType: "file",
    dueDate: "2026-02-25",
    points: 50,
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
    title: "Troubleshooting Case Study",
    description: "Analyze and document solutions for common hardware failure scenarios.",
    submissionType: "file",
    dueDate: "2026-03-01",
    points: 40,
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