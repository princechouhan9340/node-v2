import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    try {
      const { expression } = calcBody;

      if (typeof expression !== 'string' || expression.trim() === '') {
        throw new Error('Invalid expression');
      }

      const evaluateExpression = (expr: string): number => {
        expr = expr.replace(/\s+/g, '');

        if (!/^[\d+\-*/()]+$/.test(expr)) {
          throw new Error('Invalid expression');
        }

        try {
          const toPostfix = (infix: string): string[] => {
            const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
            const operators: string[] = [];
            const output: string[] = [];
            let i = 0;

            while (i < infix.length) {
              const token = infix[i];

              if (/\d/.test(token)) {
                let number = '';
                while (i < infix.length && /\d/.test(infix[i])) {
                  number += infix[i++];
                }
                output.push(number);
                i--;
              } else if (token in precedence) {
                while (
                  operators.length &&
                  precedence[operators[operators.length - 1]] >= precedence[token]
                ) {
                  output.push(operators.pop()!);
                }
                operators.push(token);
              } else if (token === '(') {
                operators.push(token);
              } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                  output.push(operators.pop()!);
                }
                operators.pop();
              }
              i++;
            }

            while (operators.length) {
              output.push(operators.pop()!);
            }

            return output;
          };

          const evaluatePostfix = (postfix: string[]): number => {
            const stack: number[] = [];

            postfix.forEach(token => {
              if (/\d/.test(token)) {
                stack.push(parseInt(token));
              } else {
                const b = stack.pop()!;
                const a = stack.pop()!;
                switch (token) {
                  case '+':
                    stack.push(a + b);
                    break;
                  case '-':
                    stack.push(a - b);
                    break;
                  case '*':
                    stack.push(a * b);
                    break;
                  case '/':
                    stack.push(a / b);
                    break;
                }
              }
            });

            return stack[0];
          };

          const postfix = toPostfix(expr);
          return evaluatePostfix(postfix);
        } catch (error) {
          throw new Error('Invalid expression');
        }
      };

      const result = evaluateExpression(expression);

      if (isNaN(result)) {
        throw new Error('Invalid expression');
      }

      return result 
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
  }
}
