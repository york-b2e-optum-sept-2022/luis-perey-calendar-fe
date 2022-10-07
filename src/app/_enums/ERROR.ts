export enum ERROR {
  INVALID_EMAIL = "Not valid email",
  LOGIN_NOT_EXIST_EMAIL = 'No User with that email',
  LOGIN_WRONG_PASSWORD = 'Wrong password!',
  LOGIN_HTTP_ERROR = 'Error during the login process, please try again',
  REGISTER_INVALID_NAME = 'Must enter valid Name',
  REGISTER_INVALID_LAST_NAME = 'Must enter valid Last Name',
  REGISTER_INVALID_PASSWORD = 'Password must have at least 5 characters',
  REGISTER_HTTP_ERROR = 'Error during the registration, please try again',
  REGISTER_DUPLICATE_EMAIL = 'Email already registered',
  REGISTER_NO_MATCH_PASSWORD = 'Passwords do not match'
}
