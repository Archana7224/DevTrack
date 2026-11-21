import { z } from "zod";

const fields = {
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(3000).optional(),
  type: z.enum(["task", "bug", "feature"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assignee: z.string().regex(/^[0-9a-fA-F]{24}$/).nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
};

export const createIssueSchema = z.object({
  title: fields.title,
  description: fields.description,
  type: fields.type.optional(),
  priority: fields.priority.optional(),
  assignee: fields.assignee,
  dueDate: fields.dueDate,
});

export const updateIssueSchema = z.object({
  title: fields.title.optional(),
  description: fields.description,
  type: fields.type.optional(),
  status: fields.status.optional(),
  priority: fields.priority.optional(),
  assignee: fields.assignee,
  dueDate: fields.dueDate,
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required",
});