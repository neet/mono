import { ActionState } from "@/utils/action_state";
import z from "zod";

export const formSchema = z
  .object({
    email_address: z.string(),
    password: z.string(),
  })
  .partial();

export type FormState = ActionState<z.TypeOf<typeof formSchema>>;
