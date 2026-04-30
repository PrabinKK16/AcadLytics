const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message =
      result.error?.issues?.[0]?.message ||
      result.error?.message ||
      "Validation failed";

    return res.status(400).json({
      success: false,
      message,
      errors: result.error?.issues || [],
    });
  }

  req.body = result.data;
  next();
};

export default validate;
