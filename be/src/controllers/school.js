import schoolModel from "../models/school";

async function getSchools(req, res, next) {
  try {
    const schools = await schoolModel.find();

    res.json(schools);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSchools,
};
