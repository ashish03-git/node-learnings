import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiErrorResponse } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";

const verifyJWTtoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json(new ApiResponse(401, null, "Access token is required"));
    }

    const jwtToken = token.split(" ")[1];
    const decodedToken = jwt.decode(jwtToken, process.env.ACCESS_TOKEN_SCECRET);
    console.log("decodedToken =>", decodedToken);

    const user = await User.findById(decodedToken.id).select(
      "-password -accessToken -refreshToken"
    );

    if (!user) {
      return res.status(401).json(
        new ApiResponse(401, {
          message: "Invalid access token",
        })
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

export { verifyJWTtoken };
