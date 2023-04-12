import { schemaRecordAttendance } from "./attendance";
import { BadRequestError } from "../utils/errors";

const validRecordAttendance = (input) => {
  const { error } = schemaRecordAttendance.validate(input);
  if (error) throw new BadRequestError(error);
};

module.exports = {
  validRecordAttendance,
};
