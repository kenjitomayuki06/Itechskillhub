import CourseTemplate from '../CourseTemplate';
import { courseOverview, courseLessons, assignmentsData } from './courseData';

export default function NSC() {
  return (
    <CourseTemplate
      courseOverview={courseOverview}
      courseLessons={courseLessons}
      assignmentsData={assignmentsData}
      breadcrumbLabel="Network Setup & Configuration"
      badgeLabel="TESDA NC II"
    />
  );
}