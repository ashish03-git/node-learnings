import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthCheck = (req, res, next) => {
//   try {
//     res.status(200).json(
//       new ApiResponse(200, {
//         message: "server is healthy and running smoothly ....",
//       })
//     );
//   } catch (error) {
//     next(error)
//   }
// };

const healthCheck = asyncHandler(async (req, res, next) => {
  res.status(200).json(
    new ApiResponse(200, {
      message: "server is healthy and running smoothly ....",
    })
  );
});

export default healthCheck;
