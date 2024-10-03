import { db } from "@/db";
import { heroSection } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { number, object, optional, safeParse, string } from "valibot";

const schema = object({
  userId: number(),
  title: optional(string()),
  tagline: optional(string()),
  fullName: optional(string()),
  description: optional(string()),
  skills: optional(string()),
  phoneNumber: optional(string()),
  linkedIn: optional(string()),
  github: optional(string()),
});

const allowedFields = [
  "title",
  "tagline",
  "fullName",
  "description",
  "skills",
  "phoneNumber",
  "linkedIn",
  "github",
] as const;

type AllowedField = (typeof allowedFields)[number];

export async function POST(request: NextRequest) {
  const parseResult = safeParse(schema, await request.json());

  if (!parseResult.success) {
    return NextResponse.json(
      {
        issue: parseResult.issues[0]?.message || "Invalid input",
      },
      { status: 400 },
    );
  }

  const { output } = parseResult;

  try {
    const updateableFields = allowedFields.reduce<
      Partial<Record<AllowedField, string>>
    >((acc, field) => {
      if (output[field] !== undefined && typeof output[field] === "string") {
        acc[field] = output[field] as string;
      }
      return acc;
    }, {});

    const [updatedRecord] = await db
      .update(heroSection)
      .set(updateableFields)
      .where(eq(heroSection.userId, output.userId))
      .returning();

    const updatedColumns = allowedFields.reduce<
      Partial<Record<AllowedField, string>>
    >((acc, field) => {
      if (field in updatedRecord) {
        acc[field] = updatedRecord[
          field as keyof typeof updatedRecord
        ] as string;
      }
      return acc;
    }, {});

    return NextResponse.json({ updated: updatedColumns });
  } catch (error) {
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : (error as Error).message;

    return NextResponse.json({ issue: errorMessage }, { status: 500 });
  }
}
