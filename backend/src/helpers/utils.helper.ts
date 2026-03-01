import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import moment from 'moment';
import { CalenderSlotTypes } from 'src/constants/app.constant';
/**
 * encrypt password
 *
 * @param textToEncrypt
 * @returns
 */
export const encrypt = async (textToEncrypt: string) => {
  const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY as string, 'hex');
  const AES_IV_BUFFER = Buffer.from(process.env.AES_IV as string, 'hex');

  const cipher = createCipheriv('aes-256-cbc', AES_ENC_KEY_BUFFER, AES_IV_BUFFER);
  let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};

/**
 * decrypt password
 * @param encryptToText
 * @returns
 */
export const decrypt = async (encryptToText: string) => {
  const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY as string, 'hex');
  const AES_IV_BUFFER = Buffer.from(process.env.AES_IV as string, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', AES_ENC_KEY_BUFFER, AES_IV_BUFFER);
  const decrypted = decipher.update(encryptToText, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};

/**
 * date to timestamp convert
 * @param date
 * @returns
 */
export const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

/**
 * Generate unique ID
 * @param prefix
 * @returns
 */
export const generateUniqueId = (prefix: string) => {
  return `${prefix}${randomBytes(4).toString('hex')}${moment().unix()}`;
};

/**
 * Check if external url is valid or not
 * @param url
 * @returns
 */
export const isUrlValid = (url: string) => {
  if (url?.indexOf('http') == 0) return true;
  return false;
};

/**
 * Check if email is valid or not
 * @param url
 * @returns
 */
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

/**
 * Clean empty fields
 * @param dto
 */
export const cleanEmptyFields = <T extends object>(dto: T): void => {
  Object.keys(dto).forEach(key => {
    const value = (dto as Record<string, unknown>)[key];
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      value === 'NaN' ||
      value === 'null' ||
      value === 'undefined'
    ) {
      delete (dto as Record<string, unknown>)[key];
    }
  });
};

/**
 * Generate start and end timestamps with timezone
 * @param startTimestamp
 * @param endTimestamp
 * @param type
 * @param timezone
 * @returns
 */
export const generateStartEndTimestampsWithTimezone = (
  startTimestamp: number,
  endTimestamp: number,
  type: CalenderSlotTypes,
  timezone: string,
) => {
  const timestamps: {
    start: number;
    end: number;
    startDate: Date;
    endDate: Date;
    startFormat: string;
    endFormat: string;
  }[] = [];

  let currentStart = moment.unix(startTimestamp).tz(timezone);
  const finalEnd = moment.unix(endTimestamp).tz(timezone);

  while (currentStart.isBefore(finalEnd)) {
    const currentEnd = moment.min(
      currentStart.clone().add(1, type).subtract(1, 'second'),
      finalEnd.clone(),
    );

    timestamps.push({
      start: currentStart.unix(),
      end: currentEnd.unix(),
      startDate: currentStart.toDate(),
      endDate: currentEnd.toDate(),
      startFormat: currentStart.format('YYYY-MM-DD HH:mm:ss'),
      endFormat: currentEnd.format('YYYY-MM-DD HH:mm:ss'),
    });

    // Safely move to the next calendar unit (DST aware)
    currentStart = currentStart.clone().add(1, type);
  }

  return timestamps;
};
