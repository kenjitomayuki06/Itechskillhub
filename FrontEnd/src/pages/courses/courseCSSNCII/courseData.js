// Course Data for Computer Systems Servicing NC II
// Contains lesson modules and assignments

export const courseOverview = {
  title: "Computer Systems Servicing NC II",
  description: "This comprehensive TESDA-aligned course prepares you for the National Certificate II in Computer Systems Servicing. Master essential skills in hardware assembly, operating system installation, network configuration, and preventive maintenance.",
  duration: "280 hours",
  level: "Beginner to Intermediate",
  prerequisites: [
    "Basic computer literacy",
    "Understanding of Windows operating system",
    "No prior technical experience required"
  ],
  whatYouWillLearn: [
    "Assemble and disassemble computer hardware components",
    "Install and configure Windows and Linux operating systems",
    "Set up and troubleshoot local area networks",
    "Perform preventive maintenance and system optimization",
    "Diagnose and resolve common computer problems",
    "Follow proper safety and ESD prevention protocols"
  ],
  certification: {
    available: true,
    name: "TESDA Computer Systems Servicing NC II Certificate",
    requirements: [
      "Complete all 16 lessons across 4 modules",
      "Pass all module assessments with 75% or higher",
      "Complete hands-on practical exercises",
      "Submit final portfolio project"
    ],
    benefits: [
      "Nationally recognized certification",
      "Enhanced employability in IT support roles",
      "Pathway to advanced technical certifications",
      "Qualification for computer technician positions"
    ]
  },
  instructor: {
    name: "TESDA-Certified Instructor",
    bio: "Experienced computer systems servicing professional with industry certifications and teaching expertise.",
    experience: "10+ years in IT support and training"
  }
};

export const courseLessons = {
  modules: [
    {
      id: 1,
      title: "Hardware Assembly Fundamentals",
      lessons: [
        {
          id: 1,
          name: "Introduction to Computer Components",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/ExxFxD4OSZ0",
          description: "Overview of motherboards, CPUs, RAM, storage, and peripheral devices.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 2,
          name: "Safety Procedures & ESD Prevention",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/nXkgbmr3dRA",
          description: "Learn essential safety protocols and electrostatic discharge prevention techniques.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 3,
          name: "Step-by-Step PC Assembly",
          duration: "25 min",
          videoUrl: "https://www.youtube.com/embed/BL4DCEp7blY",
          description: "Complete guide to assembling a computer from individual components.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 4,
          name: "BIOS Setup & Configuration",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/ezubjTO7rRI",
          description: "Configure BIOS settings for optimal system performance.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Operating System Installation",
      lessons: [
        {
          id: 5,
          name: "Creating Bootable Installation Media",
          duration: "10 min",
          videoUrl: "https://www.youtube.com/embed/wmqX1-kQKa0",
          description: "Learn how to create bootable USB drives for operating system installation.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 6,
          name: "Windows Installation Guide",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/bP03Y-l9NOM",
          description: "Complete walkthrough of Windows installation process.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 7,
          name: "Linux Installation (Ubuntu)",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/mXyN1aJYefc",
          description: "Step-by-step guide to installing Ubuntu Linux.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 8,
          name: "Driver Installation & Updates",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/mUCCvdtY34U",
          description: "Install and update essential system drivers.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Network Configuration",
      lessons: [
        {
          id: 9,
          name: "Networking Fundamentals",
          duration: "20 min",
          videoUrl: "https://www.youtube.com/embed/3QhU9jd03a0",
          description: "Understanding basic networking concepts and protocols.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 10,
          name: "Cable Termination & Testing",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/lullzS740wI",
          description: "Learn proper cable termination techniques and testing procedures.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 11,
          name: "Router & Switch Configuration",
          duration: "22 min",
          videoUrl: "https://www.youtube.com/embed/eMamgWllRFY",
          description: "Configure routers and switches for network connectivity.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 12,
          name: "Network Troubleshooting",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/1i3XdhC2ZAs",
          description: "Diagnose and resolve common network issues.",
          pdfUrl: null,
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: "Preventive Maintenance",
      lessons: [
        {
          id: 13,
          name: "System Cleaning & Thermal Management",
          duration: "12 min",
          videoUrl: "https://www.youtube.com/embed/Y51yZE18qus",
          description: "Proper cleaning techniques and thermal paste application.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 14,
          name: "Disk Maintenance & Optimization",
          duration: "15 min",
          videoUrl: "https://www.youtube.com/embed/XSvOfu2PfXk",
          description: "Optimize disk performance and maintain storage health.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 15,
          name: "Software Updates & Security",
          duration: "18 min",
          videoUrl: "https://www.youtube.com/embed/Z-zNHHpXoMM",
          description: "Keep systems secure with regular updates and patches.",
          pdfUrl: null,
          completed: false
        },
        {
          id: 16,
          name: "Performance Monitoring",
          duration: "14 min",
          videoUrl: "https://www.youtube.com/embed/kLBAHe6g6nY",
          description: "Monitor and analyze system performance metrics.",
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
    type: 'lesson', // 'lesson', 'module', or 'general'
    title: "PC Components Identification Quiz",
    description: "Complete the quiz about different computer components and their functions.",
    submissionType: "quiz", // 'text', 'file', 'link', 'quiz'
    dueDate: "2026-02-15",
    points: 20,
    status: "pending", // 'pending', 'submitted', 'graded'
    studentSubmission: null,
    grade: null,
    feedback: null
  },
  {
    id: 2,
    lessonId: 3,
    moduleId: null,
    type: 'lesson',
    title: "PC Build Documentation",
    description: "Document your PC assembly process with photos and descriptions of each step.",
    submissionType: "file",
    dueDate: "2026-02-20",
    points: 50,
    status: "pending",
    studentSubmission: null,
    grade: null,
    feedback: null
  },
  {
    id: 3,
    lessonId: null,
    moduleId: 1,
    type: 'module',
    title: "Hardware Assembly Module Assessment",
    description: "Submit a comprehensive report covering all topics in the Hardware Assembly module.",
    submissionType: "file",
    dueDate: "2026-02-25",
    points: 100,
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