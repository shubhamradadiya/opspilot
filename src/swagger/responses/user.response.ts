import { HttpStatus } from '@nestjs/common';
import { meta } from './app.response';

const authentication = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4uc25vdy5hZG1pbkBtYWlsaW5hdG9yLmNvbSIsInN1YiI6IjEiLCJqdGkiOiI2YzEzYmNhNTE5MGQ4YWQ3OTU1ZmM1MzRhNjY5MTM3NmYyZWY1NWI3MzRlMmExMjk5NzFlNDU1MzU2MmI4ZTVhIiwiaWF0IjoxNjc2NTM0Mjc0LCJleHAiOjE2Nzg5NTM0NzR9.GbKyURJOhxqScct4LWLt65xuxdJPphYHcFC1ooumH_s',
    },
    refreshToken: {
      type: 'string',
      example: 'DuAitjb1H/pnML7HTU9cnUruoOFT/K2hntcRNUKksaSBEugMyBu64ZPs+Ux8o3hd',
    },
    expiresAt: {
      type: 'number',
      example: 1678953474990,
    },
  },
};

const user = {
  type: 'object',
  properties: {
    uid: { type: 'string', example: 'U65cv4nj76543e6d2gr' },
    language: { type: 'string', example: 'en' },
    role: { type: 'string', example: 'user' },
    email: { type: 'string', example: null },
    isoCode: { type: 'string', example: 'IN' },
    countryCode: { type: 'string', example: '+91' },
    phone: { type: 'string', example: '99234567890' },
    profilePic: { type: 'string', example: 'https://example.com/profile.jpg' },
    fullName: { type: 'string', example: 'John Doe' },
    priceUnit: { type: 'string', example: '$' },
    perHourRate: { type: 'number', example: 0 },
    loanAmount: { type: 'number', example: 0 },
    isActive: { type: 'boolean', example: false },
    isClockInClockOutEnabled: { type: 'boolean', example: false },
    isInventoryEnabled: { type: 'boolean', example: false },
    isPayoutEnabled: { type: 'boolean', example: false },
    isContainerEnabled: { type: 'boolean', example: false },
    isExpenseEnabled: { type: 'boolean', example: false },
    isEveryDayDropOffEnabled: { type: 'boolean', example: false },
    isInvoiceEnabled: { type: 'boolean', example: false },
    isRingCustomerEnabled: { type: 'boolean', example: false },
    verifiedAt: { type: 'number', example: 1678953474990 },
    forgotPasswordVerifiedAt: { type: 'number', example: 1678953474990 },
    isNotificationOn: { type: 'boolean', example: true },
    createdAt: { type: 'number', example: 1678953474990 },
  },
};

export const INVALID_CREDENTIALS_RESPONSE = {
  status: HttpStatus.NOT_FOUND,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
      message: {
        type: 'string',
        example: 'The credentials you entered are incorrect. Please try again.',
      },
    },
  },
};

export const INVALID_PASSWORD_RESPONSE = {
  status: HttpStatus.CONFLICT,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CONFLICT },
      message: {
        type: 'string',
        example: 'The password entered is incorrect. Please check and try again.',
      },
    },
  },
};

export const LOGIN_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'Welcome back! You’ve logged in successfully.',
      },
      data: {
        type: 'object',
        properties: {
          ...user.properties,
          authentication,
        },
      },
    },
  },
};

export const INVALID_OLD_PASSWORD_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
      message: {
        type: 'string',
        example:
          'Please enter a valid old password. | The new password cannot be the same as your current password. Please choose a different password.',
      },
    },
  },
};

export const CHANGE_PASSWORD_SUCCESS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Your password has been updated successfully!' },
    },
  },
};

export const EMAIL_NOT_FOUND_RESPONSE = {
  status: HttpStatus.NOT_FOUND,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.NOT_FOUND },
      message: { type: 'string', example: 'Email not found' },
    },
  },
};

export const FORGET_PASSWORD_CODE_SENT_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'We’ve emailed you a password reset code. Check your inbox!',
      },
    },
  },
};

export const OTP_VERIFIED_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'Your verification code has been successfully verified.',
      },
    },
  },
};

export const INVALID_OTP_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.BAD_REQUEST },
      message: {
        type: 'string',
        example: 'The OTP you entered is invalid. Please verify and try again.',
      },
    },
  },
};

export const RESET_PASSWORD_SUCCESS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Your password has been reset successfully!' },
    },
  },
};

export const LOGOUT_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'You’ve logged out. See you again soon!' },
    },
  },
};

export const USER_DETAILS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'SUCCESS' },
      data: {
        type: 'object',
        properties: {
          ...user.properties,
        },
      },
    },
  },
};

export const CREATE_EMPLOYEE_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Employee has been created successfully!' },
      data: {
        type: 'object',
        properties: {
          ...user.properties,
        },
      },
    },
  },
};

export const UPDATE_EMPLOYEE_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Employee has been updated successfully!' },
      data: {
        type: 'object',
        properties: {
          ...user.properties,
        },
      },
    },
  },
};

export const UPDATE_EMPLOYEE_STATUS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Employee status has been updated successfully!' },
    },
  },
};

export const DELETE_EMPLOYEE_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Employee has been deleted successfully!' },
    },
  },
};

export const GET_ALL_EMPLOYEES_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'SUCCESS' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ...user.properties,
          },
        },
      },
      meta: {
        type: 'object',
        properties: {
          ...meta,
        },
      },
    },
  },
};
