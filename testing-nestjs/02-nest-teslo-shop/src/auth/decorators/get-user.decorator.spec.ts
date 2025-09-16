import { ExecutionContext, InternalServerErrorException } from "@nestjs/common"
import { getUser } from "./get-user.decorator"

jest.mock('@nestjs/common', () => ({
    createParamDecorator: jest.fn().mockImplementation(() => jest.fn()),
    InternalServerErrorException: jest.requireActual('@nestjs/common').InternalServerErrorException
}))

describe('GetUser Decorator', () => {
    const mockExecutionContent = {
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
                user: {
                    id: 1,
                    name: 'John Doe'
                }
            })
        })
    } as unknown as ExecutionContext

    it('should return the user from the request', () => {
        const result = getUser(null, mockExecutionContent)

        expect(result).toEqual({
            id: 1,
            name: 'John Doe'
        })
    })

    it('should return the user name from the request', () => {
        const result = getUser('name', mockExecutionContent)

        expect(result).toEqual('John Doe')
    })

    it('should throw an internal server error if user not found', () => {
        const mockExecutionContent = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    user: null
                })
            })
        } as unknown as ExecutionContext

        try {
            getUser(null, mockExecutionContent)
            expect(true).toBe(false)
        }
        catch (err) {
            expect(err).toBeInstanceOf(InternalServerErrorException)
            expect(err.message).toBe('User not found (request)')
        }
    })
})