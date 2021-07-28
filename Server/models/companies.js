const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const companySchema = new Schema({
  //companyId: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true, minlength: 10 },
  password: { type: String, required: true, minlength: 8 },
});

companySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Company", companySchema);
