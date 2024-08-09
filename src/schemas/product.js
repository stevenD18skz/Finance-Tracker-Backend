import zod from "zod";

export const productSchema = zod.object({
  title: zod.string({
    invalid_type_error: "product title must be string",
    required_error: "product title is requiered",
  }),
  amount: zod
    .number({
      invalid_type_error: "product amount must be int",
      required_error: "product amount is requiered",
    })
    .positive()
    .min(0)
    .max(999999),
  note: zod.string({
    invalid_type_error: "product note must be string",
    required_error: "product note is requiered",
  }),
  tags: zod.array(
    zod.enum(
      [
        "Electrónica",
        "Portátil",
        "Móvil",
        "Periférico",
        "Accesorio",
        "Pantalla",
      ],
      {
        invalid_type_error: "product type must be string",
        required_error: "product type is requiered",
      }
    )
  ),
});

export function valideProduct(input) {
  return productSchema.safeParse(input);
}

export function validePartialProduct(input) {
  return productSchema.partial().safeParse(input);
}
