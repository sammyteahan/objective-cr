import { z } from 'zod';

/**
 * A generic validation function with zod.
 *
 * example:
 *   const myFunction = validate(z.object({
 *     name: z.string(),
 *     age: z.number()
 *   }), input => {
 *     return input.name;
 *   })
 */
export function validate<
  Schema extends z.ZodSchema,
  Return,
  Input = z.infer<Schema>
>(schema: Schema, fn: (value: Input) => Return) {
  return (input: Input) => {
    const value = schema.parse(input)
    return fn(value)
  }
}
