import zod from "zod";

/*
CREATE TABLE product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  productValue INTEGER NOT NULL,
  currentMoney INTEGER NOT NULL,
  createDate DATE NOT NULL,
  goalDate DATE NOT NULL
);
?*/

export const productSchema = zod.object({
  name: zod.string({
    invalid_type_error: "product name must be string",
    required_error: "product name is required",
  }),
  productValue: zod
    .number({
      invalid_type_error: "product productValue must be int",
      required_error: "product productValue is required",
    })
    .min(0)
    .max(999999999),
  currentMoney: zod
    .number({
      invalid_type_error: "product currentMoney must be int",
      required_error: "product currentMoney is required",
    })
    .min(0)
    .max(999999999),
  description: zod.string({
    invalid_type_error: "product note must be string",
    required_error: "product note is required",
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
        required_error: "product type is required",
      }
    )
  ),
  createDate: zod.string({
    invalid_type_error: "createDate must be a valid date string",
    required_error: "createDate is required",
  }),
  goalDate: zod.string({
    invalid_type_error: "goalDate must be a valid date string",
    required_error: "goalDate is required",
  }),
});

export function valideProduct(input) {
  return productSchema.safeParse(input);
}

export function validePartialProduct(input) {
  return productSchema.partial().safeParse(input);
}
