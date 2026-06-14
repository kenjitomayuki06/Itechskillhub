import CourseTemplate from '../CourseTemplate';
import { courseOverview, courseLessons, assignmentsData } from './courseData';

export default function OSIC() {
  return (
    <CourseTemplate
      courseOverview={courseOverview}
      courseLessons={courseLessons}
      assignmentsData={assignmentsData}
      breadcrumbLabel="OS Installation & Configuration"
      badgeLabel="TESDA NC II"
      courseId={4}
    />
  );
}