export interface User {
  username: String
  email: String
  fullname: String
  dateofbirth: Date
  gender: String
}

export interface LoginRequest {
  username: String
  password: String
}

export interface RegisterRequest extends User {
  password: String
  confirmPassword: String
}

interface LoginResponse {
  status: number
  message: String
  data: {
    access_token: String
    refresh_token: String
    token_type: String
    expires_in: number
  }
}
