/**
 * Middleware factory to validate request body with Zod schema
 * @param {import('zod').ZodSchema} schema 
 */
const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.parseAsync(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validasi data gagal: " + formattedErrors.map(e => e.message).join(", "),
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

module.exports = validate;
