import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { getRawHeaders } from "./raw-headers.decorator"

jest.mock('@nestjs/common', () => ({
    createParamDecorator: jest.fn().mockImplementation(() => jest.fn())
}))

describe('RawHeader Decorator', () => {
    const mockExecutionContent = {
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
                rawHeaders: ['Autorization', 'Bearer Token', 'User-Agent', 'NestJS']
            })
        })
    } as unknown as ExecutionContext

    it('should return the raw headers from the request', () => {
        const result = getRawHeaders('', mockExecutionContent)

        expect(result).toEqual(['Autorization', 'Bearer Token', 'User-Agent', 'NestJS'])
    })

    it('should call createParamDecorator with getRawHeader', () => {
        expect(createParamDecorator).toHaveBeenCalledWith(getRawHeaders)
    })
})