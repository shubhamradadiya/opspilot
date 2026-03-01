import { HttpStatus } from '@nestjs/common';

export const meta = {
  totalItems: { type: 'number', example: 1 },
  itemsPerPage: { type: 'number', example: 10 },
  totalPages: { type: 'number', example: 1 },
  currentCount: { type: 'number', example: 1 },
};

export const BAD_REQUEST_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
      },
      message: {
        type: 'string',
        example: 'error message',
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
  },
};

export const UNAUTHORIZE_RESPONSE = {
  status: HttpStatus.UNAUTHORIZED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
    },
  },
};

export const NOT_FOUND_RESPONSE = {
  status: HttpStatus.NOT_FOUND,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.NOT_FOUND,
      },
      message: {
        type: 'string',
        example: 'Not Found',
      },
    },
  },
};