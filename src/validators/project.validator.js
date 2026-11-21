import { z } from "zod";

const projectFields = {
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  dueDate: z.coerce.date().nullable().optional(),
};

export const createProjectSchema = z.object({
  name: projectFields.name,
  description: projectFields.description,
  dueDate: projectFields.dueDate,
});

export const updateProjectSchema = z.object({
  name: projectFields.name.optional(),
  description: projectFields.description,
  status: projectFields.status,
  dueDate: projectFields.dueDate,
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required",
});