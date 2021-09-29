import { Numberu32, } from '@solana/spl-name-service';
import { Keypair,} from '@solana/web3.js';

async function keygen(prefix: string, maxCount = 1000000000) {
  let count = maxCount;
  do {
    let key = Keypair.generate();
    if (key.publicKey.toBase58().toLowerCase().startsWith(prefix.toLowerCase()) ) {
      console.log("PublicKey", key.publicKey.toBase58());
      console.log("PrivateKey", key.secretKey.toString());
      console.log("Count", maxCount - count);
      break;
    }
  } while(--count > 0);
}

if (process.argv.length != 3) {
  console.log('ts-node', 'prefix-keygen-publickey.ts', 'Prefix');
  process.exit(-1);
}

keygen(process.argv[2], 10000000000).then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(-1);
  }
);
