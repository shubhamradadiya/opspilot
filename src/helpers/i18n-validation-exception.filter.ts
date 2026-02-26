import { ArgumentsHost, Catch, ExceptionFilter, ValidationError } from '@nestjs/common';
import moment from 'moment';
import { I18nContext, I18nValidationError, I18nValidationException } from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly options: any = {
      detailedErrors: true,
    },
  ) {}
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current() as I18nContext;

    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });

    // Extract the first validation message for the main message field
    const firstMessage = this.extractFirstMessage(errors);

    switch (host.getType() as string) {
      case 'http':
        const response = host.switchToHttp().getResponse();
        response.status(this.options.errorHttpStatusCode || exception.getStatus()).send({
          statusCode: this.options.errorHttpStatusCode || exception.getStatus(),
          message: firstMessage,
          error: 'Bad Request',
          errors: this.normalizeValidationErrors(errors),
          datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
          path: host.switchToHttp().getRequest().url,
        });
        break;
      case 'graphql':
        exception.errors = this.normalizeValidationErrors(errors) as I18nValidationError[];
        return exception;
    }
  }

  private isWithErrorFormatter(options: any): options is any {
    return 'errorFormatter' in options;
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object | string {
    if (this.isWithErrorFormatter(this.options) && !('detailedErrors' in this.options))
      return this.options.errorFormatter(validationErrors);

    if (!this.isWithErrorFormatter(this.options))
      return this.flattenValidationErrors(validationErrors) as string;

    return validationErrors;
  }

  protected flattenValidationErrors(validationErrors: ValidationError[]) {
    return Object.values(validationErrors[0].constraints as any)[0];
  }

  private extractFirstMessage(validationErrors: ValidationError[]): string {
    if (!validationErrors || validationErrors.length === 0) {
      return 'Validation failed';
    }

    const firstError = validationErrors[0];

    // Check if it has constraints with translated messages
    if (firstError.constraints && typeof firstError.constraints === 'object') {
      const constraintValues = Object.values(firstError.constraints);
      if (constraintValues.length > 0 && typeof constraintValues[0] === 'string') {
        return constraintValues[0];
      }
    }

    // Fallback to property name if no constraint message found
    return firstError.property || 'Validation failed';
  }
}
