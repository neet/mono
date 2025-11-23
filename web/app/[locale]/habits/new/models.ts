import { ActionState } from "@/utils/action_state";
import z from "zod";

export const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  rrule: z.string(),
  tzid: z.string(),
});

export type FormState = ActionState<z.TypeOf<typeof formSchema>>;

