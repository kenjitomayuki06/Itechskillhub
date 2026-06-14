import CourseTemplate from '../CourseTemplate';
import { courseOverview, courseLessons, assignmentsData } from './courseData';

export default function PChardwareAT() {
  return (
    <CourseTemplate
      courseOverview={courseOverview}
      courseLessons={courseLessons}
      assignmentsData={assignmentsData}
      breadcrumbLabel="PC Hardware Assembly & Troubleshooting"
      badgeLabel="TESDA NC II"
      courseId={3}
    />
  );
}