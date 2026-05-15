import CSSNCII from "../../assets/CSSNCII.png";
import PCHardware from "../../assets/PCHardware.png";
import NetworkSetup from "../../assets/NetworkSetup.png";
import OSInstallation from "../../assets/OSInstallation.png";

const coursesData = [
  {
    id: 1,
    title: "Computer Systems Servicing NC II",
    level: "Beginner to Intermediate",
    description:
      "Complete TESDA-aligned training covering hardware assembly, OS installation, network setup, and system maintenance.",
    image: CSSNCII,
    hours: "280 hours",
    students: "0",
    rating: "0",
    modules: "4 Modules",
    lessons: "16 Lessons",
    badge: "Bestseller",
    free: true,
    route: "/course/css-ncii", // Added route property
  },
  {
    id: 2,
    title: "PC Hardware Assembly & Troubleshooting",
    level: "Beginner",
    description:
      "Master the art of building, upgrading, and repairing computers. Learn component selection and hands-on assembly.",
    image: PCHardware,
    hours: "80 hours",
    students: "0",
    rating: "0",
    modules: "3 Modules",
    lessons: "8 Lessons",
    free: true,
    route: "/course/pc-hardware", // Added route property (for future use)
  },
  {
    id: 3,
    title: "Network Setup & Configuration",
    level: "Intermediate",
    description:
      "Learn to set up LANs, configure routers, and troubleshoot common network issues. Prepare for real-world networking.",
    image: NetworkSetup,
    hours: "60 hours",
    students: "0",
    rating: "0",
    modules: "3 Modules",
    lessons: "6 Lessons",
    badge: "New",
    free: true,
    route: "/course/network-setup", // Added route property
  },
  {
    id: 4,
    title: "Operating System Installation & Configuration",
    level: "Beginner",
    description:
      "Comprehensive training on Windows and Linux installation, configuration, drivers, and system optimization.",
    image: OSInstallation,
    hours: "50 hours",
    students: "0",
    rating: "0",
    modules: "3 Modules",
    lessons: "6 Lessons",
    free: true,
    route: "/course/os-installation", // Added route property (for future use)
  },
];

export default coursesData;