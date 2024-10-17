"use server";

import { db } from "@/db";
import { donations, NewDonation } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const addDonation = async (donationData: NewDonation) => {
  await db.insert(donations).values(donationData);
  revalidatePath("/");
};
