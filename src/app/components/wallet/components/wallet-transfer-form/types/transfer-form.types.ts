import { TCommonForm } from './common-form.type';

export type TTransferData<T> = {
    receiveAddress: string;
    amount: number;
    coin: T;
}

export type TTransferFormValue = TTransferData<string>;
export type TTransferForm = TCommonForm<TTransferFormValue>;
