import { schema, arrayOf } from 'normalizr';

const token = new schema.Entity('tokens');

const credit_sends = new schema.Entity('credit_sends');
const credit_receives = new schema.Entity('credit_receives');

const transfer_account = new schema.Entity('transfer_accounts', {
    credit_sends: [credit_sends],
    credit_receives: [credit_receives],
    token: token
});

const user = new schema.Entity('users', {
    transfer_accounts: [transfer_account],
});

const attached_images = new schema.Entity('attached_images');

const credit_transfer = new schema.Entity('credit_transfers', {
    sender_transfer_account: transfer_account,
    sender_user: user,
    recipient_transfer_account: transfer_account,
    recipient_user: user,
    attached_images: attached_images
});

export const transferAccountSchema =  [ transfer_account ];

export const creditTransferSchema = [ credit_transfer ];

export const userSchema = [ user ];