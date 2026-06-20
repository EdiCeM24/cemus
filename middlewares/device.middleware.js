import useragent from "useragent";
import { v4 as uuidv4 } from "uuid";


export const detectDevice =
(req, res, next) => {

  const agent =
    useragent.parse(req.headers["user-agent"]);

  req.device = {

    deviceId:
      req.cookies.deviceId || uuidv4(),

    browser: agent.toAgent(),

    os: agent.os.toString(),

    ipAddress:
      req.ip,
  };

  next();
};