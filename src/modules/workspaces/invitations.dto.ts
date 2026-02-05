import { z } from "zod";

export const createInvitationSchema = z.object({
    email: z.string().email(),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;

export const invitationResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    role: z.string(),
    status: z.string(),
    expiresAt: z.date(),
    createdAt: z.date(),
});

export type InvitationResponse = z.infer<typeof invitationResponseSchema>;
