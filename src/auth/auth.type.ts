import { UserDto } from "src/user/dto/user.dto";

export interface LoginResponse {
    access_token: string;
    data: {
        user: {
            email: string;
        }
    };
}