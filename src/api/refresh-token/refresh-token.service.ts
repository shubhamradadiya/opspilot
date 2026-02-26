import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import moment from 'moment';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { decrypt, encrypt } from 'src/helpers/utils.helper';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Find refresh token by id
   * @param id
   * @returns
   */
  async findOne(id: string) {
    return await this.refreshTokenRepository.findOne({
      where: { id },
      relations: ['accessToken', 'accessToken.user'],
    });
  }

  /**
   * Create refresh token
   * @param decodedToken
   * @returns
   */
  async createToken(decodedToken: { iat: number; exp: number; jti: string }) {
    const refreshTokenLifeTime = moment().add(1, 'year').toDate();

    const refreshToken = randomBytes(64).toString('hex');
    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        id: refreshToken,
        accessToken: { id: decodedToken.jti },
        expiresAt: refreshTokenLifeTime ?? undefined,
      }),
    );

    return encrypt(refreshToken);
  }

  /**
   * Revoke refresh token using JTI
   * @param jwtUniqueIdentifier
   */
  async revokeTokenUsingJti(jwtUniqueIdentifier: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { accessToken: { id: jwtUniqueIdentifier } },
    });
    if (!refreshToken) return null;

    refreshToken.isRevoked = true;
    await this.refreshTokenRepository.save(refreshToken);
  }

  /**
   * Validate and find refresh token
   * @param encryptedRefreshToken
   * @returns
   */
  async validateRefreshToken(encryptedRefreshToken: string) {
    try {
      // Decrypt the refresh token
      const decryptedToken = await decrypt(encryptedRefreshToken);

      // Find the refresh token in database
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { id: decryptedToken },
        relations: ['accessToken', 'accessToken.user'],
      });

      if (!refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token is revoked
      if (refreshToken.isRevoked) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // Check if token is expired
      const currentDate = new Date();
      if (refreshToken.expiresAt < currentDate) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Check if access token exists and user exists
      if (!refreshToken.accessToken || !refreshToken.accessToken.user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return refreshToken;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revoke refresh token by id
   * @param refreshTokenId
   */
  async revokeTokenById(refreshTokenId: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: refreshTokenId },
    });
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }
}
