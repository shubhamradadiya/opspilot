import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenService } from 'src/api/access-token/access-token.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Languages } from 'src/constants/app.constant';
import { IRequestHeader } from 'src/interfaces/request-header.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private accessTokensService: AccessTokenService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('APP_KEY'),
      passReqToCallback: true,
    });
  }

  /**
   * validate user
   * @param payload
   * @returns
   */
  async validate(req: Request, payload: IJwtPayload) {
    const accessToken = await this.accessTokensService.findOne(payload?.jti);

    if (!accessToken?.user) {
      throw new UnauthorizedException();
    }

    //Normalize headers (case-insensitive keys)
    const headers = req?.headers ?? {};
    const normalizedHeaders = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
    );
    // Extract and type-cast header values
    const timezone = (normalizedHeaders['timezone'] as string) ?? null;
    const acceptLanguage = normalizedHeaders['accept-language'] as Languages;

    const language = Object.values(Languages).includes(acceptLanguage)
      ? acceptLanguage
      : Languages.EN;

    const requestHeader: IRequestHeader = {
      acceptLanguage: language,
      timezone,
    };
    return { ...accessToken.user, jti: payload?.jti, requestHeader };
  }
}
