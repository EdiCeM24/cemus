import useragent from "useragent";
import { v4 as uuidv4 } from "uuid";
import { NODE_ENV } from "../config/env.js";

export const detectDevice = (req, res, next) => {
  try {
    const agent = useragent.parse(req.headers["user-agent"]);
    const deviceId = req.cookies.deviceId || uuidv4();

    req.device = {
      deviceId: deviceId,

      browser: agent.toAgent(),

      os: agent.os.toString(),

      ipAddress: req.ip,
    };

    // set deviceId cookie if it's new
    if (!req.cookies.deviceId) {
      res.cookie("deviceId", deviceId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        secure: NODE_ENV === "production",
      });
    }
  } catch (error) {
    console.log("Error detecting device: ", error);
    req.flash("error_msg", "Error detecting device: ", error);
    next(error);
  }

  next();
};
