import 'reflect-metadata';

import { validate } from "class-validator";
import { PaginationDto } from "./pagination.dto"
import { plainToInstance } from 'class-transformer';

describe('PaginationDto', () => {
    it('should validate with default values', async () => {
        const dto = new PaginationDto();
        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    })

    it('should validate with valid data', async () => {
        const dto = new PaginationDto();
        dto.limit = 10
        dto.page = 1

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    })

    it('should not validate with invalid page', async () => {
        const dto = new PaginationDto();
        dto.page = -1

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThanOrEqual(0);

        errors.forEach(err => {
            if (err.property === 'page') {
                expect(err.constraints?.min).toBeDefined();
            }
            else {
                expect(true).toBeFalsy()
            }
        })
    })


    it('should not validate with invalid limit', async () => {
        const dto = new PaginationDto();
        dto.limit = -1

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThanOrEqual(0);

        errors.forEach(err => {
            if (err.property === 'limit') {
                expect(err.constraints?.min).toBeDefined();
            }
            else {
                expect(true).toBeFalsy()
            }
        })
    })

    it('should convert strings into numbers', async () => {
        const input = { limit: '10', page: '2' };
        const dto = plainToInstance(PaginationDto, input);

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
        expect(dto.page).toBe(2);
        expect(dto.limit).toBe(10);
    })
})