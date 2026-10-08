import type { Id, IsoDate } from './common.js';

/** Who a session belongs to. The two are never interchangeable. */
export enum Audience {
  /** Back-office staff of a store (`User`). */
  Staff = 'staff',
  /** A shopper of a store (`Customer`). */
  Customer = 'customer',
}

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  Staff = 'staff',
}

/** Higher ranks include the permissions of lower ones. */
export const USER_ROLE_RANK: Record<UserRole, number> = {
  [UserRole.Staff]: 1,
  [UserRole.Admin]: 2,
  [UserRole.Owner]: 3,
};

export enum UserStatus {
  Invited = 'invited',
  Active = 'active',
  Disabled = 'disabled',
}

export const PASSWORD = { minLength: 10, maxLength: 200 } as const;

export interface LoginInput {
  audience: Audience;
  email: string;
  password: string;
}

export interface SessionTokenInput {
  /** The session token returned at sign-in. */
  refreshToken: string;
}

/** Asks for a password-reset email. The answer never says whether the email exists. */
export interface PasswordResetRequestInput {
  audience: Audience;
  email: string;
}

/** Sets a new password with the token from the email. */
export interface PasswordResetRedemptionInput {
  /** The token in the link of the email. Valid once, for one hour. */
  token: string;
  password: string;
}

/** How long a password-reset link works. */
export const PASSWORD_RESET_TTL_MINUTES = 60;

export interface AccessToken {
  accessToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

export interface SessionTokens extends AccessToken {
  /** Long-lived session token; exchange it for new access tokens. */
  refreshToken: string;
}

export interface User {
  id: Id;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: IsoDate;
  createdAt: IsoDate;
}

export interface StaffSignIn extends SessionTokens {
  user: User;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  status?: UserStatus.Active | UserStatus.Disabled;
  /** Setting a password signs the user out everywhere. */
  password?: string;
}
