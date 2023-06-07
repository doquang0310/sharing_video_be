import { BadRequestException } from "@nestjs/common";


export function validateEmail(email: string): boolean {
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!regExp.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    return true;
}