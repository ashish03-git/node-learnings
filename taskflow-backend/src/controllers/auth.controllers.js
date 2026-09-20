import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiErrorResponse } from "../utils/api-errors.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefereshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiErrorResponse(409, "User with email already exists.");
  }

  const user = await User.create({
    email,
    password,
    username,
    role: role,
    isEmailVerified: false,
  });

  // temprary tokens created
  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemproryToken();
  generateAccessAndRefereshTokens(user._id);
  user.forgotPasswordTokenExpiry = tokenExpiry;
  user.emailVerificationToken = hashedToken;

  await user.save({ validateBeforeSave: false });

  // send email to verification
  const options = {
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.email,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
    ),
  };
  await sendEmail(options);

  // removing fields we don't want to send
  const createdUser = await User.findById(user._id).select(
    "-password -accessToken -refereshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationExpiry"
  );
  if (!createdUser) {
    throw new ApiErrorResponse(500, "Something went worng while registering user");
  }
  // sending back response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: createdUser,
      },
      "User registered successfully and verification email has been sent on your mail."
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, { message: "email or password is missing" }));
  }

  const user = await User.findOne({ email });
  const isPasswordMatch = user.isPasswordCorrect(user.password);
  if (!user._id && !isPasswordMatch) {
    return res.status(400).json(new ApiResponse(400, { message: "email or password is invalid" }));
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationExpiry"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
      },
      "user logged in successfully."
    )
  );
});

export { registerUser, loginUser };
