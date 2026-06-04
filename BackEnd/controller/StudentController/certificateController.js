import { getStudentCertificatesQuery } from '../../database/studentQueries/certificateQuery.js';

export async function getCertificates(req, res) {
    try {
        const studentId = req.user.user_id
        const certificates = await getStudentCertificatesQuery(studentId);

        return res.status(200).json({
            success: true,
            certificates: certificates
        });
    } catch (error) {
        console.error("Error retieving student certificates catalog: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load certificates portfolio data."
        });
    }
}