export const HttpMessage = {
  // Auth
  REGISTER_SUCCESS:        'Account created successfully. Save your API key — it will not be shown again.',
  LOGIN_SUCCESS:           'Logged in successfully.',
  LOGOUT_SUCCESS:          'Logged out successfully.',
  ROTATE_KEY_SUCCESS:      'API key rotated. Update your application config with the new key.',
  INVALID_CREDENTIALS:     'Invalid email or password.',
  EMAIL_ALREADY_EXISTS:    'An account with this email already exists.',
  UNAUTHORIZED:            'Authentication required. Please provide a valid token or API key.',
  FORBIDDEN:               'You do not have permission to perform this action.',
  TOKEN_EXPIRED:           'Your session has expired. Please log in again.',
  INVALID_API_KEY:         'Invalid or inactive API key.',
 
  // Validation
  VALIDATION_ERROR:        'One or more fields are invalid.',
  MISSING_REQUIRED_FIELDS: 'Please provide all required fields.',
  INVALID_EMAIL:           'Please provide a valid email address.',
  INVALID_CHANNEL:         'Channel must be one of: email, sms, webhook.',
 
  // Notifications
  NOTIFICATION_QUEUED:     'Notification queued for delivery.',
  NOTIFICATION_DUPLICATE:  'Duplicate request — notification already queued.',
  NOTIFICATION_NOT_FOUND:  'Notification not found.',
 
  // General
  NOT_FOUND:               'The requested resource was not found.',
  INTERNAL_ERROR:          'Something went wrong. Please try again later.',
  SERVICE_UNAVAILABLE:     'Service temporarily unavailable. Please try again later.',
  TOO_MANY_REQUESTS:       'Too many requests. Please slow down.',
} as const

export type HttpMessageKey = keyof typeof HttpMessage;
export type HttpMessageValue = (typeof HttpMessage)[HttpMessageKey]