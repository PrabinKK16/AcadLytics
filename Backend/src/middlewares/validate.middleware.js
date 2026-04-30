const validate = (schema) => (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export default validate;
