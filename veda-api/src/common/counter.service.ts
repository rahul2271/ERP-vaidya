import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Counter, CounterDocument } from './schemas/counter.schema';

const PREFIXES: Record<string, string> = {
  UHID: 'UHID',
  OPD: 'OPD',
  IPD: 'IPD',
  DAY_CARE: 'DC',
};

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  /**
   * Atomically returns the next sequence number for (hospital, type, currentYear),
   * creating the counter document on first use. Numbers reset to 1 each calendar
   * year, per standard hospital registration practice.
   */
  private async nextSeq(hospitalId: string, type: string): Promise<{ seq: number; year: number }> {
    const year = new Date().getFullYear();
    const counter = await this.counterModel.findOneAndUpdate(
      { hospitalId: new Types.ObjectId(hospitalId), type, year },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    ).exec();
    return { seq: counter.seq, year };
  }

  /**
   * Returns a formatted, hospital-scoped registration number, e.g. "OPD-2026-00001".
   * `type` is one of UHID | OPD | IPD | DAY_CARE.
   */
  async generateNumber(hospitalId: string, type: 'UHID' | 'OPD' | 'IPD' | 'DAY_CARE', prefixOverride?: string): Promise<string> {
    const { seq, year } = await this.nextSeq(hospitalId, type);
    const prefix = prefixOverride || PREFIXES[type];
    return `${prefix}-${year}-${String(seq).padStart(5, '0')}`;
  }
}
