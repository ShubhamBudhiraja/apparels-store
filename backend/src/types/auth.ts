export type IOtpValidationScreenType = "register" | "forgotPassword";

export interface IValidateOtp {
    userId?: string;
    emailId?: string;
    otp: string;
    screenType: IOtpValidationScreenType;
}
