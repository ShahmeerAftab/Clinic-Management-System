import Patient from "@/models/patients";
import User from "@/models/user";

// Find-or-create a Patient document for a given User
export async function ensurePatientProfile(userId: string) {
  let patient = await Patient.findOne({ userId });

  if (!patient) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error(`Cannot create Patient profile: User ${userId} not found.`);
    }

    patient = await Patient.create({
      name:      user.name,
      age:       "N/A",
      gender:    "N/A",
      contact:   user.email,
      userId:    userId,
      createdBy: "self",
    });

    console.log(`[ensurePatientProfile] Created Patient profile for userId=${userId}`);
  }

  return patient;
}
