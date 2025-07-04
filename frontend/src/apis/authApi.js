import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // User Registration & Login
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // OAuth Authentication
    googleLogin: builder.mutation({
      query: (googleData) => ({
        url: 'auth/google',
        method: 'POST',
        body: googleData,
      }),
    }),
    microsoftLogin: builder.mutation({
      query: (microsoftData) => ({
        url: 'auth/microsoft',
        method: 'POST',
        body: microsoftData,
      }),
    }),
    githubLogin: builder.mutation({
      query: (githubData) => ({
        url: 'auth/github',
        method: 'POST',
        body: githubData,
      }),
    }),

    // Password Management
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: resetData,
      }),
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: 'auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: 'auth/update-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),

    // OTP Management
    sendOtp: builder.mutation({
      query: (email) => ({
        url: 'auth/send-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: 'auth/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: 'auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),

    // Email Verification
    sendEmailVerification: builder.mutation({
      query: (email) => ({
        url: 'auth/send-email-verification',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (verificationData) => ({
        url: 'auth/verify-email',
        method: 'POST',
        body: verificationData,
      }),
    }),

    // User Profile & Settings
    getUserProfile: builder.query({
      query: (userId) => `auth/profile/${userId}`,
      providesTags: (result, error, id) => [{ type: 'UserProfile', id }],
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: 'auth/profile/update',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'UserProfile', id: userId }],
    }),
    deleteUserAccount: builder.mutation({
      query: (userId) => ({
        url: `auth/account/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Session Management
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: 'auth/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    validateToken: builder.query({
      query: () => 'auth/validate-token',
      providesTags: [{ type: 'Token', id: 'VALIDATION' }],
    }),
    revokeToken: builder.mutation({
      query: (tokenId) => ({
        url: `auth/revoke-token/${tokenId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Token', id: 'LIST' }],
    }),

    // Two-Factor Authentication
    enable2FA: builder.mutation({
      query: (twoFactorData) => ({
        url: 'auth/2fa/enable',
        method: 'POST',
        body: twoFactorData,
      }),
    }),
    disable2FA: builder.mutation({
      query: (twoFactorData) => ({
        url: 'auth/2fa/disable',
        method: 'POST',
        body: twoFactorData,
      }),
    }),
    verify2FA: builder.mutation({
      query: (twoFactorData) => ({
        url: 'auth/2fa/verify',
        method: 'POST',
        body: twoFactorData,
      }),
    }),
    generate2FASecret: builder.query({
      query: () => 'auth/2fa/generate-secret',
      providesTags: [{ type: 'TwoFactor', id: 'SECRET' }],
    }),

    // Account Security
    getLoginHistory: builder.query({
      query: (userId) => `auth/login-history/${userId}`,
      providesTags: [{ type: 'LoginHistory', id: 'LIST' }],
    }),
    getActiveSessions: builder.query({
      query: (userId) => `auth/active-sessions/${userId}`,
      providesTags: [{ type: 'ActiveSessions', id: 'LIST' }],
    }),
    terminateSession: builder.mutation({
      query: (sessionId) => ({
        url: `auth/terminate-session/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ActiveSessions', id: 'LIST' }],
    }),
    terminateAllSessions: builder.mutation({
      query: (userId) => ({
        url: `auth/terminate-all-sessions/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ActiveSessions', id: 'LIST' }],
    }),

    // User Preferences
    getUserPreferences: builder.query({
      query: (userId) => `auth/preferences/${userId}`,
      providesTags: (result, error, id) => [{ type: 'UserPreferences', id }],
    }),
    updateUserPreferences: builder.mutation({
      query: (preferences) => ({
        url: 'auth/preferences/update',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'UserPreferences', id: userId }],
    }),

    // Account Status & Verification
    checkAccountStatus: builder.query({
      query: (email) => `auth/account-status/${email}`,
      providesTags: [{ type: 'AccountStatus', id: 'LIST' }],
    }),
    requestAccountUnlock: builder.mutation({
      query: (email) => ({
        url: 'auth/request-unlock',
        method: 'POST',
        body: { email },
      }),
    }),
    unlockAccount: builder.mutation({
      query: (unlockData) => ({
        url: 'auth/unlock-account',
        method: 'POST',
        body: unlockData,
      }),
    }),

    // Social Login Connections
    connectSocialAccount: builder.mutation({
      query: (socialData) => ({
        url: 'auth/connect-social',
        method: 'POST',
        body: socialData,
      }),
    }),
    disconnectSocialAccount: builder.mutation({
      query: (provider) => ({
        url: `auth/disconnect-social/${provider}`,
        method: 'DELETE',
      }),
    }),
    getConnectedAccounts: builder.query({
      query: (userId) => `auth/connected-accounts/${userId}`,
      providesTags: [{ type: 'ConnectedAccounts', id: 'LIST' }],
    }),

    // Authentication Analytics
    getAuthAnalytics: builder.query({
      query: (params) => ({
        url: 'auth/analytics',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'AuthAnalytics', id: 'LIST' }],
    }),
    getLoginAttempts: builder.query({
      query: (userId) => `auth/login-attempts/${userId}`,
      providesTags: [{ type: 'LoginAttempts', id: 'LIST' }],
    }),

    // Admin Authentication Management
    getUsersList: builder.query({
      query: (params) => ({
        url: 'auth/admin/users',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'UsersList', id: 'LIST' }],
    }),
    updateUserStatus: builder.mutation({
      query: (statusData) => ({
        url: 'auth/admin/update-status',
        method: 'PUT',
        body: statusData,
      }),
      invalidatesTags: [{ type: 'UsersList', id: 'LIST' }],
    }),
    bulkUserOperations: builder.mutation({
      query: (operations) => ({
        url: 'auth/admin/bulk-operations',
        method: 'POST',
        body: operations,
      }),
      invalidatesTags: [{ type: 'UsersList', id: 'LIST' }],
    }),

    // Authentication Settings
    getAuthSettings: builder.query({
      query: () => 'auth/settings',
      providesTags: [{ type: 'AuthSettings', id: 'LIST' }],
    }),
    updateAuthSettings: builder.mutation({
      query: (settings) => ({
        url: 'auth/settings/update',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: [{ type: 'AuthSettings', id: 'LIST' }],
    }),

    // Password Policies
    getPasswordPolicies: builder.query({
      query: () => 'auth/password-policies',
      providesTags: [{ type: 'PasswordPolicies', id: 'LIST' }],
    }),
    updatePasswordPolicies: builder.mutation({
      query: (policies) => ({
        url: 'auth/password-policies/update',
        method: 'PUT',
        body: policies,
      }),
      invalidatesTags: [{ type: 'PasswordPolicies', id: 'LIST' }],
    }),

    // Rate Limiting & Security
    getRateLimitInfo: builder.query({
      query: (ip) => `auth/rate-limit/${ip}`,
      providesTags: [{ type: 'RateLimit', id: 'LIST' }],
    }),
    getSecurityEvents: builder.query({
      query: (params) => ({
        url: 'auth/security-events',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'SecurityEvents', id: 'LIST' }],
    }),
  }),
});

export const {
  // User Registration & Login
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,

  // OAuth Authentication
  useGoogleLoginMutation,
  useMicrosoftLoginMutation,
  useGithubLoginMutation,

  // Password Management
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdatePasswordMutation,

  // OTP Management
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,

  // Email Verification
  useSendEmailVerificationMutation,
  useVerifyEmailMutation,

  // User Profile & Settings
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserAccountMutation,

  // Session Management
  useRefreshTokenMutation,
  useValidateTokenQuery,
  useRevokeTokenMutation,

  // Two-Factor Authentication
  useEnable2FAMutation,
  useDisable2FAMutation,
  useVerify2FAMutation,
  useGenerate2FASecretQuery,

  // Account Security
  useGetLoginHistoryQuery,
  useGetActiveSessionsQuery,
  useTerminateSessionMutation,
  useTerminateAllSessionsMutation,

  // User Preferences
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,

  // Account Status & Verification
  useCheckAccountStatusQuery,
  useRequestAccountUnlockMutation,
  useUnlockAccountMutation,

  // Social Login Connections
  useConnectSocialAccountMutation,
  useDisconnectSocialAccountMutation,
  useGetConnectedAccountsQuery,

  // Authentication Analytics
  useGetAuthAnalyticsQuery,
  useGetLoginAttemptsQuery,

  // Admin Authentication Management
  useGetUsersListQuery,
  useUpdateUserStatusMutation,
  useBulkUserOperationsMutation,

  // Authentication Settings
  useGetAuthSettingsQuery,
  useUpdateAuthSettingsMutation,

  // Password Policies
  useGetPasswordPoliciesQuery,
  useUpdatePasswordPoliciesMutation,

  // Rate Limiting & Security
  useGetRateLimitInfoQuery,
  useGetSecurityEventsQuery,
} = authApi; 