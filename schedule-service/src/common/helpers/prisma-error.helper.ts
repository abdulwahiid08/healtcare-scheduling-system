import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMA_ERROR_CODE } from '../constants/prisma-error-code.constant';

export function handlePrismaError(
  error: unknown,
  entityName = 'Data',
  identifier?: string,
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case PRISMA_ERROR_CODE.NOT_FOUND:
        throw new NotFoundException(
          `Opps! ${entityName} not found (id: ${identifier ? `"${identifier}"` : ''})`,
        );

      case PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT:
        throw new BadRequestException(
          `Duplicate value on field: ${(
            error.meta?.target as string[]
          )?.join(', ')}`,
        );
    }
  }

  throw new InternalServerErrorException(error);
}
