export interface RegisterApiBody {
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

export interface LoginApiBody {
  email: string,
  password: string,
  twoFactorCode: null | string,
  twoFactorRecoveryCode: null | string
}

export interface LoginApiResult {
  tokenType: string,
  accessToken: string,
  expiresIn: number,
  refreshToken: string
}

export interface RegisterApiResult {
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