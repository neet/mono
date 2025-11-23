import { ActionState } from "@/utils/action_state";
import z from "zod";

export const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
}).partial();

export type FormState = ActionState<z.TypeOf<typeof formSchema>>;

