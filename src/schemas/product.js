import zod from "zod";

export const productSchema = zod.object({
  title: zod.string({
    invalid_type_error: "movie title must be string",
    required_error: "movie title is requiered",
  }),
  precio: zod
    .number({
      invalid_type_error: "movie title must be string",
      required_error: "movie title is requiered",
    })
    .positive()
    .min(0)
    .max(9999),
  descripcion: zod.string({
    invalid_type_error: "movie title must be string",
    required_error: "movie title is requiered",
  }),
  type: zod.array(
    zod.enum(["Health", "Set up"], {
      invalid_type_error: "movie title must be string",
      required_error: "movie title is requiered",
    })
  ),
});

export function valideProduct(input) {
  return productSchema.safeParse(input);
}

export function validePartialProduct(input) {
  return productSchema.partial().safeParse(input);
}
