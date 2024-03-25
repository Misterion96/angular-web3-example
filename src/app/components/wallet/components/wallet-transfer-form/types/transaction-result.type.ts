import { EnTransactionResultStatus } from '../enum';

export type TTransactionResult = {
    status: EnTransactionResultStatus
    value?: string
}
