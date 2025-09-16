import { validate } from "class-validator"
import { CreateUserDto } from "./create-user.dto"

describe('CreateUserDto', () => {

    it('should have the correct properties', async () => {
        const dto = new CreateUserDto()

        dto.email = 'test1@gmail.com'
        dto.password = 'Abc123'
        dto.fullName = 'Jono Jono'

        const errors = await validate(dto)
        expect(errors.length).toBe(0)
    })

    it('should throw error if passowrd is not valid', async () => {
        const dto = new CreateUserDto()

        dto.email = 'test1@gmail.com'
        dto.password = 'abc123'
        dto.fullName = 'Jono Jono'

        const errors = await validate(dto)
        const passwordError = errors.find(error => error.property === 'password')

        expect(errors.length).toBe(1)
        expect(passwordError.constraints).toBeDefined()
        expect(passwordError.constraints.matches).toBe('The password must have a Uppercase, lowercase letter and a number')
    })
})