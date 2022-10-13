export enum ERROR {
  INVALID_EMAIL = "Not valid email",
  //ON LOGIN
  LOGIN_NOT_EXIST_EMAIL = 'No User with that email',
  LOGIN_WRONG_PASSWORD = 'Wrong password!',
  LOGIN_HTTP_ERROR = 'Error during the login process, please try again',
  //ON REGISTER
  REGISTER_INVALID_NAME = 'Must enter valid Name',
  REGISTER_INVALID_LAST_NAME = 'Must enter valid Last Name',
  REGISTER_INVALID_PASSWORD = 'Password must have at least 5 characters',
  REGISTER_HTTP_ERROR = 'Error during the registration, please try again',
  REGISTER_DUPLICATE_EMAIL = 'Email already registered',
  REGISTER_NO_MATCH_PASSWORD = 'Passwords do not match',
  //ON EVENT SERVICE
  EVENT_SERVICE_HTTP_ERROR = 'Problems getting the Event List',
  EVENT_INVALID_NAME = 'Name must have a name',
  EVENT_INVALID_DESCRIPTION = 'Event must have a description',
  EVENT_INVALID_PLACE = 'Event must have a place',
  EVENT_INVALID_ADDRESS = 'Event must have an address',
  EVENT_INVALID_DURATION = 'Event must have a valid duration',
  EVENT_INVALID_DURATION_TIME = 'Event must have at least 15 minutes duration',
  EVENT_INVALID_DATE = 'Event must have a date',
  EVENT_INVALID_TIME = 'Event must have a time'
}
