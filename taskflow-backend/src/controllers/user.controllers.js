import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json(new ApiResponse(200, { user }, "user info fetched successfully."));
});

export { getUserInfo };
