/**
 * lib/ensurePatient.ts
 *
 * A small helper that guarantees every patient user has a matching
 * Patient document in MongoDB.
 *
 * Usage:
 *   import { ensurePatientProfile } from "@/lib/ensurePatient";
 *   const patient = await ensurePatientProfile(userId);
 *
 * - If a Patient record already exists for this userId, it is returned as-is.
 * - If no Patient record exists yet, one is created automatically using
 *   the user's name and email from the User collection.
 */

import Patient from "@/models/patients";
import User from "@/models/user";

/**
 * Find-or-create a Patient document for a given User.
 *
 * @param userId  The string form of the User's MongoDB _id
 * @returns       The existing or newly-created Patient document
 * @throws        If the User document cannot be found
 */
export async function ensurePatientProfile(userId: string) {
  // Step 1: Check whether a Patient profile already exists for this user
  let patient = await Patient.findOne({ userId });

  // Step 2: If not, create a minimal one automatically
  if (!patient) {
    // We need the user's name + email to fill in the Patient record
    const user = await User.findById(userId);

    if (!user) {
      // This should never happen if the caller has a valid JWT, but guard anyway
      throw new Error(`Cannot create Patient profile: User ${userId} not found.`);
    }

    // Create the Patient document.
    // "N/A" placeholders can be updated by the patient from their profile page.
    patient = await Patient.create({
      name:      user.name,         // taken from the signup form
      age:       "N/A",             // patient fills in later
      gender:    "N/A",             // patient fills in later
      contact:   user.email,        // default to email; patient can update
      userId:    userId,            // links this Patient → User
      createdBy: "self",            // marks that the patient signed up themselves
    });

    console.log(`[ensurePatientProfile] Created Patient profile for userId=${userId}`);
  }

  return patient;
}
