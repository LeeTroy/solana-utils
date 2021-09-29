import {
    Connection,
    PublicKey,
} from '@solana/web3.js';

import {
    getNameAccountKey,
    getHashedName,
    getNameOwner,
} from '@solana/spl-name-service';

async function snslookup(domain: string) {
  let conn = new Connection('https://solana-api.projectserum.com');
  
  const rootNameKey = await getNameAccountKey(await getHashedName('ROOT-TLD'));
  console.log('ROOT-TLD', rootNameKey.toBase58());
  
  const solNameKey = await getNameAccountKey(await getHashedName('.sol'), undefined, rootNameKey);
  console.log('.sol', solNameKey.toBase58());

  let domains = domain.split('.').reverse();
  if (domains[0] == 'sol')
    domains.shift();

  let parentNameKey = solNameKey;
  let subdomain = false;
  let resolved = 'sol';
  while (domains.length) {
    resolved = domains[0] + '.' + resolved;
    if (subdomain)
      domains[0] = '\0' + domains[0];
    else
      subdomain = true;
    let hashedName = await getHashedName(domains[0]);
    let nameAccount = await getNameAccountKey(hashedName, PublicKey.default, parentNameKey);
    try {
      let owner = await getNameOwner(conn, nameAccount);
      parentNameKey = nameAccount;
      console.debug('domain', resolved);
      console.debug('  nameAccount', nameAccount.toBase58());
      console.debug('  owner', owner.owner.toBase58());
      domains.shift();
    } catch(e) {
      console.error(e);
      break;
    }
  }
  console.log(resolved, parentNameKey.toBase58());
}

if (process.argv.length != 3) {
  console.log(process.argv[0], process.argv[1], 'sub.domain.sol');
  process.exit(-1);
}

snslookup(process.argv[2]).then(
    () => {
        process.exit(0);
    },
    err => {
        console.error(err);
        process.exit(-1);
    },
);
