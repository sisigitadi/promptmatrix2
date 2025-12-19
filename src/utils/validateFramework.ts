import Ajv, { ErrorObject } from "ajv";
import frameworkSchema from "../schemas/framework.schema.json";
import { Framework } from "../types";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(frameworkSchema);

export function validateFramework(framework: Framework): {
  isValid: boolean;
  errors: ErrorObject[] | null;
} {
  const isValid = validate(framework);
  if (!isValid) {
    return { isValid: false, errors: validate.errors || null };
  } else {
    return { isValid: true, errors: null };
  }
}
