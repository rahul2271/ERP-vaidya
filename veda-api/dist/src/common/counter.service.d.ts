import { Model } from 'mongoose';
import { CounterDocument } from './schemas/counter.schema';
export declare class CounterService {
    private counterModel;
    constructor(counterModel: Model<CounterDocument>);
    private nextSeq;
    generateNumber(hospitalId: string, type: 'UHID' | 'OPD' | 'IPD' | 'DAY_CARE', prefixOverride?: string): Promise<string>;
}
