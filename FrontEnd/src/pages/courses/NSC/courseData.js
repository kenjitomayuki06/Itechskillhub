// Course Data for Network Setup & Configuration
// Contains lesson modules and assignments

export const courseOverview = {
  title: "Network Setup & Configuration",
  description: "Learn to set up LANs, configure routers, and troubleshoot common network issues. This comprehensive course covers network fundamentals, cable installation, router configuration, and real-world networking scenarios to prepare you for networking careers.",
  duration: "60 hours",
  level: "Intermediate",
  prerequisites: [
    "Basic computer literacy",
    "Understanding of operating systems",
    "Familiarity with Internet concepts"
  ],
  whatYouWillLearn: [
    "Understand TCP/IP and network protocols",
    "Install and terminate network cables",
    "Configure routers and switches",
    "Set up wireless networks",
    "Troubleshoot network connectivity issues",
    "Implement basic network security"
  ],
  certification: {
    available: true,
    name: "Network Setup & Configuration Certificate",
    requirements: [
      "Complete all 6 lessons across 3 modules",
      "Pass all module assessments with 75% or higher",
      "Complete hands-on network lab exercises",
      "Submit network design project"
    ],
    benefits: [
      "Industry-recognized certification",
      "Qualification for network technician roles",
      "Enhanced network troubleshooting skills",
      "Foundation for advanced networking certifications"
    ]
  },
  instructor: {
    name: "Certified Network Professional",
    bio: "Experienced network engineer with extensive hands-on experience in network design, implementation, and troubleshooting.",
    experience: "12+ years in networking and training"
  }
};

export const courseLessons = {
  modules: [
    {
      id: 1,
      title: "Network Fundamentals",
      lessons: [
        {
          id: 1,
          name: "Introduction to Networking",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/3QhU9jd03a0",
          description: "Understanding basic networking concepts, topologies, and protocols.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 2,
          name: "TCP/IP Protocol Suite",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/PpsEaqJV_A0",
          description: "Deep dive into TCP/IP, IP addressing, and subnetting.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Cable Installation & Testing",
      lessons: [
        {
          id: 3,
          name: "Network Cable Types",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/7-rTNgOCjeg",
          description: "Understanding different network cable types and their uses.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 4,
          name: "Cable Termination & Testing",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/lullzS740wI",
          description: "Learn proper cable termination techniques and testing procedures.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Router & Switch Configuration",
      lessons: [
        {
          id: 5,
          name: "Router Configuration Basics",
          duration: "22 min",
          videoUrl: "https://www.youtube.com/embed/eMamgWllRFY",
          description: "Configure routers for network connectivity and routing.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 6,
          name: "Network Troubleshooting",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/1i3XdhC2ZAs",
          description: "Diagnose and resolve common network issues.",
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
    title: "IP Addressing Quiz",
    description: "Complete the quiz on IP addressing and subnetting concepts.",
    submissionType: "quiz",
    dueDate: "2026-02-20",
    points: 20,
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
    title: "Cable Termination Documentation",
    description: "Document your cable termination process with photos and test results.",
    submissionType: "file",
    dueDate: "2026-02-27",
    points: 30,
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
    title: "Network Design Project",
    description: "Design and document a small office network including router configuration.",
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