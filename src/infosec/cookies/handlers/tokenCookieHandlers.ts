import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";

// const  process.env.NEW_KIDS as string  = fs.readFileSync(
//   path.resolve(
//     __dirname,
//     "../../keys/refreshTokenKeys/refreshTokenPrivate.key"
//   ),
//   "utf8"
// );

import { AuthModel } from "../../../middleware/authorization/dbModel";

const refreshTokenHandler = async (user: any) => {
  const refreshToken = await jwt.sign(
    {
      refreshToken: await user._id,
    },
    process.env.NEW_KIDS as string,
    {
      issuer: await user._id,
      subject: await user.email,
      audience: "https://www.datetask.com",
      expiresIn: "672h",
      algorithm: "HS256",
    }
  );
  await AuthModel.findByIdAndUpdate(await user._id, {
    refreshTokens: [refreshToken],
  });

  return refreshToken;
};

const accessTokenHandler = async (idValue: any) => {
  const newAccessToken = jwt.sign({ access: await idValue }, await idValue, {
    issuer: await idValue,
    subject: await idValue,
    audience: "https://www.datetask.com",
    expiresIn: "1800000",
  });
  return newAccessToken;
};

export { refreshTokenHandler, accessTokenHandler };
