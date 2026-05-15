import { getAllCoursesQuery } from "../../database/CoursesQuery/getCourses.js";

export async function getAllCoursesController(req, res) {
    try {
        const courses = await getAllCoursesQuery();
        res.status(200).json({
            success: true,
            courses: courses
        });
    } catch (error) {
        console.error("Error in get all courses controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
