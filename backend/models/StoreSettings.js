const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    shippingFee: { type: Number, default: 0, min: 0 },
    codEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

storeSettingsSchema.statics.getSettings = async function getSettings() {
  const existing = await this.findOne({ key: "default" });
  if (existing) return existing;
  return this.create({ key: "default" });
};

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
