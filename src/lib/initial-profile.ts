import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import db from "./db";

export async function initialProfile() {
  const user = await currentUser();
  if (!user) {
    return RedirectToSignIn;
  }

  const profile = await db.profile.findUnique({
    where: {
      user_id: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      user_id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
}
