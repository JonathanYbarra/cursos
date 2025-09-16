import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { LoginUserDto } from "./login-user.dto"

describe('LoginUserDto', () => {

    it('should have the correct properties', async () => {
        const dto = plainToClass(LoginUserDto, {
            email: 'test1@gmail.com',
            password: 'Abc123'
        })

        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    it('should throw error if passowrd is not valid', async () => {
        const dto = plainToClass(LoginUserDto, {
            email: 'test1@gmail.com',
            password: 'abc123'
        })

        const errors = await validate(dto)
        const passwordError = errors.find(error => error.property === 'password')

        expect(errors.length).toBe(1)
        expect(passwordError.constraints).toBeDefined()
        expect(passwordError.constraints.matches).toBe('The password must have a Uppercase, lowercase letter and a number')
    })
})