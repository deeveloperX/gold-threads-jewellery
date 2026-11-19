const StoreSettings = require("../models/StoreSettings");

const MAX_SHIPPING_FEE = 1000000;

const parseShippingFee = (value) => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) return Number(value.trim());
  return null;
};

const presentSettings = (settings) => ({
  shippingFee: settings.shippingFee,
  codEnabled: settings.codEnabled,
});

exports.getStoreSettings = async (req, res) => {
  try {
    const settings = await StoreSettings.getSettings();
    res.json(presentSettings(settings));
  } catch (error) {
    console.error(`Unable to load store settings: ${error.message}`);
    res.status(500).json({ message: "Unable to load store settings" });
  }
};

exports.updateStoreSettings = async (req, res) => {
  const shippingFee = parseShippingFee(req.body?.shippingFee);
  const { codEnabled } = req.body ?? {};

  if (shippingFee === null || shippingFee < 0 || shippingFee > MAX_SHIPPING_FEE) {
    return res.status(400).json({ message: "Enter a shipping fee in whole rupees." });
  }
  if (typeof codEnabled !== "boolean") {
    return res.status(400).json({ message: "Choose whether cash on delivery is available." });
  }

  try {
    const settings = await StoreSettings.getSettings();
    settings.shippingFee = shippingFee;
    settings.codEnabled = codEnabled;
    await settings.save();
    res.json(presentSettings(settings));
  } catch (error) {
    console.error(`Unable to save store settings: ${error.message}`);
    res.status(500).json({ message: "Unable to save store settings" });
  }
};
