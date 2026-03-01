import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { Languages } from 'src/constants/app.constant';
import { DEFAULT_TIME_ZONE } from 'src/constants/user.constant';

export function AppHeaders() {
  return applyDecorators(
    // Accept Language
    ApiHeader({
      name: 'Accept-Language',
      description: 'User language',
      schema: {
        type: 'string',
        enum: Object.values(Languages),
        example: Languages.EN,
      },
      required: true,
    }),

    //Timezone
    ApiHeader({
      name: 'timezone',
      description: 'Please pass user timezone',
      required: false,
      schema: {
        type: 'string',
        example: DEFAULT_TIME_ZONE,
      },
    }),
  );
}
