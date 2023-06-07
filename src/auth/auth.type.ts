export interface LoginResponse {
  data: {
    user: {
      email: string;
      accessToken: string;
    };
  };
}

export interface DecodeJwt {
  id: number;
  email: string;
}
