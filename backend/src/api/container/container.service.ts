import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Container } from './entity/container.entity';
import { ContainerDocument } from './entity/container-document.entity';
import { I18nService } from 'nestjs-i18n';
import { AddContainerDto } from './dto/add-container.dto';
import { User } from '../user/entities/user.entity';
import { generateUniqueId } from 'src/helpers/utils.helper';
import moment from 'moment-timezone';
import type { Express } from 'express';
import {
  deleteFile,
  uploadFile,
  validateFileSize,
  validateFileType,
} from 'src/helpers/file-upload.helper';
import {
  CSV_EXTENSIONS,
  DOCS_EXTENSIONS,
  PDF_EXTENSIONS,
  XLSX_EXTENSIONS,
} from 'src/constants/app.constant';
import { UpdateContainerDto } from './dto/update-container.dto';
import { ContainerStatus, UserRoles } from 'src/constants/user.constant';

@Injectable()
export class ContainerService {
  constructor(
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,

    @InjectRepository(ContainerDocument)
    private readonly containerDocumentRepository: Repository<ContainerDocument>,

    private readonly i18n: I18nService,
  ) {}

  /**
   * Add a new booking
   * @param authUser The authenticated user
   * @param addContainerDto The container data
   * @param containerDocuments The container documents
   * @returns The created container
   */
  async addContainer(
    authUser: User,
    addContainerDto: AddContainerDto,
    containerDocuments: Express.Multer.File[],
  ) {
    // Check if user has the permission to access container
    if (authUser.role === UserRoles.USER && !authUser.isContainerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Container' } }),
      );
    }

    const existingContainer = await this.findContainerByBookingNumber(
      addContainerDto.bookingNumber,
    );

    if (existingContainer) {
      throw new BadRequestException(
        this.i18n.t('exception.ALREADY_EXISTS', {
          args: { property: 'Container with this booking number' },
        }),
      );
    }

    const containerObject = this.containerRepository.create({
      cId: generateUniqueId('C'),
      bookingNumber: addContainerDto.bookingNumber,
      containerCount: addContainerDto.containerCount,
      avgWeightInKgs: addContainerDto.avgWeightInKgs,
      loadingDate: addContainerDto.loadingDate
        ? moment(addContainerDto.loadingDate).toDate()
        : null,
      etdDate: addContainerDto.etdDate ? moment(addContainerDto.etdDate).toDate() : null,
      etaDate: addContainerDto.etaDate ? moment(addContainerDto.etaDate).toDate() : null,
      status: addContainerDto?.status || ContainerStatus.LOADING,
      user: { id: authUser.id },
    });

    const container = await this.containerRepository.save(containerObject);

    if (containerDocuments && containerDocuments.length) {
      await this.storeContainerDocuments(container.id, containerDocuments);
    }

    return await this.getDetailedContainer(container.cId);
  }

  /**
   * Update a container
   * @param updateContainerDto The container data
   * @param authUser The authenticated user
   * @param containerDocuments The container documents
   * @returns The updated container
   */
  async updateContainer(
    authUser: User,
    cId: string,
    updateContainerDto: UpdateContainerDto,
    containerDocuments: Express.Multer.File[],
  ) {
    // Check if user has the permission to access container
    if (authUser.role === UserRoles.USER && !authUser.isContainerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Container' } }),
      );
    }

    const existingContainer = await this.getDetailedContainer(cId);

    if (!existingContainer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Container' } }),
      );
    }

    if (
      updateContainerDto.bookingNumber &&
      updateContainerDto.bookingNumber !== existingContainer.bookingNumber
    ) {
      const conflict = await this.findContainerByBookingNumber(updateContainerDto.bookingNumber);

      if (conflict && conflict.cId !== cId) {
        throw new ConflictException(
          this.i18n.t('exception.ALREADY_EXISTS', {
            args: { property: 'Container with this container number' },
          }),
        );
      }
    }

    const loadingDate = updateContainerDto.loadingDate
      ? moment(updateContainerDto.loadingDate).toDate()
      : existingContainer.loadingDate;

    const etdDate = updateContainerDto.etdDate
      ? moment(updateContainerDto.etdDate).toDate()
      : existingContainer.etdDate;

    const etaDate = updateContainerDto.etaDate
      ? moment(updateContainerDto.etaDate).toDate()
      : existingContainer.etaDate;

    Object.assign(existingContainer, {
      ...updateContainerDto,
      loadingDate,
      etdDate,
      etaDate,
    });

    const container = await this.containerRepository.save(existingContainer);

    if (containerDocuments && containerDocuments.length) {
      await this.storeContainerDocuments(Number(container.id), containerDocuments);
    }

    if (updateContainerDto.deleteDocumentIds && updateContainerDto.deleteDocumentIds.length) {
      const documentIds = updateContainerDto.deleteDocumentIds.split(',').map(id => id.trim());
      await this.deleteContainerDocuments(documentIds);
    }

    return await this.getDetailedContainer(container.cId);
  }

  /**
   * Delete a container
   * @param authUser The authenticated user
   * @param cId The cId of the container
   * @returns Success message
   */
  async deleteContainer(authUser: User, cId: string) {
    // Check if user has the permission to access container
    if (authUser.role === UserRoles.USER && !authUser.isContainerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Container' } }),
      );
    }

    const existingContainer = await this.findContainerByCid(cId);

    if (!existingContainer) {
      throw new NotFoundException(
        this.i18n.t('exception.NOT_FOUND', { args: { property: 'Container' } }),
      );
    }

    await this.containerRepository.softDelete({ cId: existingContainer.cId });

    const containerDocuments = await this.containerDocumentRepository
      .createQueryBuilder('containerDocument')
      .where('containerDocument.deletedAt IS NULL')
      .andWhere('containerDocument.containerId = :containerId', {
        containerId: existingContainer.id,
      })
      .getMany();

    if (containerDocuments && containerDocuments.length) {
      const documentIds = containerDocuments.map(document => document.cdId);
      await this.deleteContainerDocuments(documentIds);
    }

    return {
      statusCode: HttpStatus.OK,
      message: this.i18n.t('translate.DELETED', { args: { property: 'Container' } }),
    };
  }

  /**
   * Get all containers
   * @param authUser Authenticated user
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param startTimestamp The start timestamp to filter the attendance timestamps
   * @param endTimestamp The end timestamp to filter the attendance timestamps
   * @param search The search query
   * @returns The containers and total count
   */
  async getAllContainers(
    authUser: User,
    count: number,
    limit: number,
    startTimestamp?: number,
    endTimestamp?: number,
    search?: string,
  ) {
    // Check if user has the permission to access container
    if (authUser.role === UserRoles.USER && !authUser.isContainerEnabled) {
      throw new ForbiddenException(
        this.i18n.t('exception.USER_PERMISSION_DENIED', { args: { property: 'Container' } }),
      );
    }

    const normalizedSearch = search?.trim().toLowerCase();
    const numericSearch = Number(normalizedSearch);

    const hasDateFilter = !!(
      startTimestamp &&
      endTimestamp &&
      startTimestamp !== null &&
      endTimestamp !== null
    );

    const startDate = moment(startTimestamp).toDate();
    const endDate = moment(endTimestamp).toDate();

    const baseQb = this.containerRepository
      .createQueryBuilder('container')
      .leftJoinAndMapMany(
        'container.containerDocuments',
        ContainerDocument,
        'containerDocument',
        'containerDocument.containerId = container.id AND containerDocument.deletedAt IS NULL',
      )
      .where('container.deletedAt IS NULL');

    if (hasDateFilter) {
      baseQb.andWhere('container.loadingDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (normalizedSearch) {
      this.applySearchFilter(baseQb, numericSearch);
      baseQb.setParameters({
        search: `%${normalizedSearch}%`,
        avgWeightInKgs: numericSearch,
        containerCount: numericSearch,
      });
    }

    const [containers, total] = await baseQb
      .orderBy('container.createdAt', 'DESC')
      .skip(count)
      .take(limit)
      .getManyAndCount();

    return { containers, total };
  }

  /**
   * Get booking numbers for containers
   * @param count The number of records to skip
   * @param limit The limit of records to return
   * @param search The search query
   * @returns The booking numbers and total count
   */
  async getBookingNumbersForContainers(count: number, limit: number, search?: string) {
    const normalizedSearch = search?.trim().toLowerCase();

    const baseQb = this.containerRepository
      .createQueryBuilder('container')
      .select(['container.bookingNumber AS number'])
      .distinct(true)
      .where('container.deletedAt IS NULL')
      .andWhere('container.bookingNumber IS NOT NULL')
      .andWhere("TRIM(container.bookingNumber) <> ''");

    if (normalizedSearch) {
      baseQb.andWhere('container.bookingNumber ILIKE :search', {
        search: `%${normalizedSearch}%`,
      });
      baseQb.addSelect(
        'CASE WHEN container.bookingNumber ILIKE :startsWith THEN 0 ELSE 1 END',
        'rank',
      );
    }

    const bookingsQb = await baseQb
      .clone()
      .orderBy(normalizedSearch ? 'rank' : 'container.bookingNumber', 'ASC')
      .addOrderBy('container.bookingNumber', 'ASC');

    if (normalizedSearch) {
      bookingsQb.setParameters({
        search: `%${normalizedSearch}%`,
        startsWith: `${normalizedSearch}%`,
      });
    }

    const bookings = await bookingsQb.skip(count).take(limit).getRawMany();

    const bookingNumbers =
      bookings && bookings.length > 0 ? bookings.map(booking => booking.number) : [];

    const totalResult = await baseQb
      .clone()
      .select('COUNT(DISTINCT container.bookingNumber)', 'total')
      .getRawOne();

    const total = Number(totalResult?.total || 0);

    return { bookingNumbers, total };
  }

  /**
   * Find a container by its cId
   * @param cId The cId of the container
   * @returns The container
   */
  async findContainerByCid(cId: string) {
    return await this.containerRepository
      .createQueryBuilder('container')
      .where('container.deletedAt IS NULL')
      .andWhere('container.cId = :cId', { cId })
      .getOne();
  }

  /**
   * Get detailed container by its unique container ID
   * @param cId The unique container ID of the container
   * @returns The container with container documents and user details
   */
  async getDetailedContainer(cId: string) {
    return await this.containerRepository
      .createQueryBuilder('container')
      .leftJoinAndSelect('container.user', 'user')
      .leftJoinAndMapMany(
        'container.containerDocuments',
        ContainerDocument,
        'containerDocument',
        'containerDocument.containerId = container.id AND containerDocument.deletedAt IS NULL',
      )
      .where('container.deletedAt IS NULL')
      .andWhere('container.cId = :cId', { cId })
      .getOne();
  }

  /**
   * Find a container by its bookingNumber
   * @param bookingNumber The bookingNumber of the booking
   * @returns The container
   */
  async findContainerByBookingNumber(bookingNumber: string) {
    return await this.containerRepository
      .createQueryBuilder('container')
      .where('container.deletedAt IS NULL')
      .andWhere('container.bookingNumber = :bookingNumber', { bookingNumber })
      .getOne();
  }

  /**
   * Store container documents
   * @param containerId The container ID
   * @param containerDocuments The container documents
   * @returns void
   */
  async storeContainerDocuments(containerId: number, containerDocuments: Express.Multer.File[]) {
    const containerDocumentFiles: {
      document: string;
      documentType: string;
      documentSize: number;
      documentName: string;
    }[] = [];

    if (containerDocuments && containerDocuments.length) {
      const validDocuments: Express.Multer.File[] = [];

      for (const document of containerDocuments) {
        const isValidFileType = validateFileType(
          document,
          `${DOCS_EXTENSIONS}|${PDF_EXTENSIONS}|${XLSX_EXTENSIONS}|${CSV_EXTENSIONS}`,
        );

        const isValidFileSize = validateFileSize(document, 5);

        if (!isValidFileSize) {
          throw new BadRequestException(
            this.i18n.t('exception.MAX_FILE_SIZE_EXCEEDED', { args: { property: '5 MB' } }),
          );
        }

        if (!isValidFileType) {
          throw new BadRequestException(this.i18n.t('exception.ONLY_DOCS_ALLOWED'));
        }

        validDocuments.push(document);
      }

      for (const document of validDocuments) {
        containerDocumentFiles.push({
          document: uploadFile('containers', document),
          documentType: document.originalname.split('.').pop()?.toLowerCase() || '',
          documentSize: document.size,
          documentName: document.originalname,
        });
      }
    }

    if (containerDocumentFiles.length) {
      const containerDocumentObject: ContainerDocument[] = containerDocumentFiles.map(
        documentFile =>
          this.containerDocumentRepository.create({
            cdId: generateUniqueId('CD'),
            document: documentFile.document,
            documentType: documentFile.documentType,
            documentSize: documentFile.documentSize.toString(),
            documentName: documentFile.documentName,
            container: { id: containerId },
          }),
      );

      await this.containerDocumentRepository.save(containerDocumentObject);
    }
  }

  /**
   * Delete container documents by IDs
   * @param documentIds Document IDs
   * @returns void
   */
  async deleteContainerDocuments(documentIds: string[]) {
    if (!documentIds.length) return;

    const containerDocuments = await this.containerDocumentRepository.find({
      where: { cdId: In(documentIds) },
    });
    for (const containerDocument of containerDocuments) {
      deleteFile(containerDocument.document);
    }
    if (containerDocuments.length) {
      await this.containerDocumentRepository.softDelete({
        cdId: In(containerDocuments.map(containerDocument => containerDocument.cdId)),
      });
    }
  }

  /**
   * Apply search filter to the query builder
   * @param qb Query builder
   * @param numericSearch Numeric search value
   */
  private applySearchFilter(qb: SelectQueryBuilder<any>, numericSearch: number) {
    qb.andWhere(
      new Brackets(qb => {
        qb.where('LOWER(container.bookingNumber) LIKE :search')
          .orWhere('LOWER(container.status::text) LIKE :search')
          .orWhere(`to_char(container."loadingDate", 'YYYY-MM-DD') LIKE :search`)
          .orWhere(`to_char(container."etdDate", 'YYYY-MM-DD') LIKE :search`)
          .orWhere(`to_char(container."etaDate", 'YYYY-MM-DD') LIKE :search`);

        if (!isNaN(numericSearch)) {
          qb.orWhere('container.avgWeightInKgs = :avgWeightInKgs');
          qb.orWhere('container.containerCount = :containerCount');
        }
      }),
    );
  }
}
