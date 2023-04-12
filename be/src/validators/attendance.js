const Joi = require("joi");

const schemaRecordAttendance = Joi.object({
  userId: Joi.string().required(),
  schoolId: Joi.string().required(),
  type: Joi.string().valid("checkin", "checkout").required(),
  temperature: Joi.number().required(),
  image: Joi.string().uri().required(),
});

module.exports = {
  schemaRecordAttendance,
};
