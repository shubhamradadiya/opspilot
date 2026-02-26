import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  /**
   * Index page
   * @returns
   */
  @Get()
  @Render('pages/index')
  index() {
    return null;
  }

  /**
   * Privacy policy
   * @returns
   */
  @Get('privacy-policy')
  @Render('pages/privacy-policy')
  privacyPolicy() {
    return null;
  }

  /**
   * Terms & Conditions
   * @returns
   */
  @Get('terms-and-conditions')
  @Render('pages/terms-and-conditions')
  termsAndConditions() {
    return null;
  }

  /**
   * Support page
   * @returns
   */
  @Get('support')
  @Render('pages/support')
  support() {
    return null;
  }

  /**
   * Delete account page
   * @returns
   */
  @Get('delete-account')
  @Render('pages/delete-account')
  deleteAccount() {
    return null;
  }
}
