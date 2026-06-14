import CourseTemplate from '../CourseTemplate';
import { courseOverview, courseLessons, assignmentsData } from './courseData';

export default function CourseCSSNCII() {
  return (
    <CourseTemplate
      courseOverview={courseOverview}
      courseLessons={courseLessons}
      assignmentsData={assignmentsData}
      breadcrumbLabel="Computer Systems Servicing NC II"
      badgeLabel="TESDA NC II"
      courseId={1}
    />
  );
}