import { DateISO } from "./common.type"

// Users/AddUsers

export interface AddUserBody {
  email: string,
  password: string,
  name: string,
  family: string
  phoneNumber: string
  salePatternCount: 0,
  currencyPatternCount: 0,
  goldPatternCount: 0,
  projectPatternCount: 0,
  servicePatternCount: 0,
  airTicketPatternCount: 0,
  exportPatternCount: 0
}

export interface AddUser {
  packageNo: number,
  name: string,
  family: string,
  phoneNumber: string,
  salePatternCount: number,
  currencyPatternCount: number,
  goldPatternCount: number,
  projectPatternCount: number,
  servicePatternCount: number,
  airTicketPatternCount: number,
  exportPatternCount: number,
  companies: any[],
  id: string,
  userName: string,
  normalizedUserName: string,
  email: string,
  normalizedEmail: string,
  emailConfirmed: boolean,
  passwordHash: string,
  securityStamp: string,
  concurrencyStamp: string,
  phoneNumberConfirmed: boolean,
  twoFactorEnabled: boolean,
  lockoutEnd: string,
  lockoutEnabled: boolean,
  accessFailedCount: number
}

// Users/Login

export interface LoginBody {
  email: string,
  password: string,
  twoFactorCode: null | string,
  twoFactorRecoveryCode: null | string
}

export interface Login {
  tokenType: string,
  accessToken: string,
  expiresIn: number,
  refreshToken: string
}

// Users/UserInfo

export type UserInfo = [UserDetails];

export interface UserDetails {
  id: string,
  packageNo: number,
  name: string,
  family: string,
  phoneNumber: number,
  userName: string,
  email: string,
  salePatternCount: number,
  currencyPatternCount: number,
  goldPatternCount: number,
  projectPatternCount: number,
  servicePatternCount: number,
  airTicketPatternCount: number,
  exportPatternCount: number,
  createdDate: DateISO,
  modifiedDate: DateISO
}

// Users/UpdateUser

export interface UpdateUserBody {
  name: string,
  family: string,
  phoneNumber: string,
}

export type UpdateUser = null;

// Users/ForgetPassword

export interface ForgetPasswordBody {
  email: string
}

export type ForgetPassword = null;

// Users/ResetPassword

export interface ResetPasswordBody {
  password: string,
  confirmPassword: string,
  email: string,
  token: string
}

export type ResetPassword = null;
