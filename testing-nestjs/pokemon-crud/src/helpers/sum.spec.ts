import { sum } from "./sum.helper";

describe('sum helper', () => {
    it('should sum two numbers', () => {
        // Arrange
        const n1 = 10;
        const n2 = 20;

        // Act
        const result = sum(n1, n2)

        // Assert
        expect(result).toBe(n1 + n2)
    })
})
