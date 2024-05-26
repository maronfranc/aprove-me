import { Injectable } from '@nestjs/common';
import { Payable } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { PayableDto } from './dtos/payables.dto';
import { PartialPayableDto } from './dtos/partial-payable.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class PayableService {
  constructor(private prisma: PrismaService) { }

  async createPayable(dto: PayableDto): Promise<Payable> {
    return this.prisma.payable.create({
      data: {
        value: dto.value,
        emissionDate: dto.emissionDate,
        assignorId: dto.assignor,
      },
    });
  }

  async updatePayable(id: string, dto: PartialPayableDto): Promise<Payable> {
    return this.prisma.payable.update({
      where: { id },
      data: {
        value: dto.value,
        emissionDate: dto.emissionDate,
        assignorId: dto.assignor,
      },
    });
  }

  async getPage(params: PaginationDto & { includeAssignor: boolean }) {
    const { limit, cursorId, page, includeAssignor } = params;
    const offset = (page - 1) * limit;
    type FindManyParam = Parameters<PrismaService['payable']['findMany']>[0];
    const findManyParam: FindManyParam = {
      skip: offset,
      take: limit,
      include: { assignor: !!includeAssignor },
    }
    if (cursorId) findManyParam.cursor = { id: cursorId };

    const [total, items] = await Promise.all([
      this.prisma.payable.count(),
      this.prisma.payable.findMany(findManyParam),
    ]);

    return {
      itemsTotal: total,
      pageTotal: Math.ceil(total / limit),
      items,
    };
  }

  async getPayableById(id: string): Promise<Payable | null> {
    return this.prisma.payable.findUnique({ where: { id } });
  }

  async deletePayable(id: string): Promise<Payable> {
    return this.prisma.payable.delete({ where: { id } });
  }
}
