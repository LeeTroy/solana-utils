import {
    Connection,
    PublicKey,
} from '@solana/web3.js';

import {
    getNameAccountKey,
    getHashedName,
    getNameOwner,
} from '@solana/spl-name-service';

async function main(args: string[]) {
    let conn = new Connection('https://solana-api.projectserum.com');
    let tldKey = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');
    let hashedName = await getHashedName(args[2]);
    let nameAccount = await getNameAccountKey(hashedName, PublicKey.default, tldKey);
    console.log('nameAccount', nameAccount.toBase58());
    let owner = await getNameOwner(conn, nameAccount);
    console.log('owner', owner.owner.toBase58());
}

main(process.argv).then(
    () => {
        process.exit(0);
    },
    err => {
        console.error(err);
        process.exit(-1);
    },
);
