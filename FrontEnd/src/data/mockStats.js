export const adminStats = {
  totalStudents: 1234,
  totalInstructors: 8,
  activeCourses: 4,
  totalCertificates: 156,
  recentEnrollments: [
    { date: '2026-02-14', count: 15 },
    { date: '2026-02-13', count: 23 },
    { date: '2026-02-12', count: 18 },
    { date: '2026-02-11', count: 31 },
    { date: '2026-02-10', count: 12 },
    { date: '2026-02-09', count: 25 },
    { date: '2026-02-08', count: 19 },
  ],
  courseCompletionRates: [
    { course: 'CSS NC II', rate: 68 },
    { course: 'PC Hardware', rate: 75 },
    { course: 'Network Setup', rate: 82 },
    { course: 'OS Installation', rate: 71 },
  ],
};

export const mockUsers = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    email: 'juan@mail.com',
    role: 'student',
    enrolledCourses: ['CSS NC II', 'PC Hardware'],
    progress: 45,
    status: 'active',
    lastLogin: '2026-02-12',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@mail.com',
    role: 'student',
    enrolledCourses: ['PC Hardware'],
    progress: 80,
    status: 'active',
    lastLogin: '2026-02-14',
  },
  {
    id: 3,
    name: 'Prof. Santos',
    email: 'santos@mail.com',
    role: 'instructor',
    coursesTeaching: ['CSS NC II', 'Network Setup'],
    students: 87,
    status: 'active',
    lastLogin: '2026-02-14',
  },
];