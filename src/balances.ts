import dotenv from 'dotenv';
import { derivePath } from 'ed25519-hd-key';
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  PublicKey,
} from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';

dotenv.config();

/** BIP-44 coin type for Solana */
const SOLANA_COIN = 501;

/**
 * Derives a Solana Keypair from a mnemonic at a given BIP-44 index.
 */
function keypairFromMnemonic(mnemonic: string, index: number): Keypair {
  const seed = mnemonicToSeedSync(mnemonic);
  const seedHex = seed.toString('hex');
  const path = `m/44'/${SOLANA_COIN}'/${index}'/0'`;
  const { key } = derivePath(path, seedHex);
  return Keypair.fromSeed(key.slice(0, 32));
}

/**
 * Consolidate all SOL from the first `count` accounts into `destination`.
 * Skips any account whose balance is too small to cover the fee.
 */
export async function consolidateTo(
  mnemonic: string,
  destination: string,
  count = 5
) {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const destPubkey = new PublicKey(destination);

  for (let i = 0; i < count; i++) {
    const kp = keypairFromMnemonic(mnemonic, i);
    const balance = await connection.getBalance(kp.publicKey);

    console.log(
      `Account #${i}: ${kp.publicKey.toBase58()} — ${
        balance / LAMPORTS_PER_SOL
      } SOL`
    );

    if (balance === 0) {
      console.log('  ↳ Skipping (0 balance)');
      continue;
    }

    // 1) Fetch a recent blockhash for fee estimation
    const { blockhash: feeBlockhash } = await connection.getLatestBlockhash('confirmed');

    // 2) Build a tx carrying the full balance so we can compute fee
    const feeTx = new Transaction({
      feePayer: kp.publicKey,
      recentBlockhash: feeBlockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: kp.publicKey,
        toPubkey: destPubkey,
        lamports: balance, // estimate with full balance
      })
    );

    // 3) Compile & ask RPC for the exact fee
    const feeResponse = await connection.getFeeForMessage(
      feeTx.compileMessage(),
      'confirmed'
    );
    const fee = feeResponse.value ?? 0;

    const lamportsToSend = balance - fee;
    if (lamportsToSend <= 0) {
      console.log(`  ↳ Skipping (balance ${balance} ≤ fee ${fee})`);
      continue;
    }

    // 4) Fetch fresh blockhash for the real send
    const { blockhash: sendBlockhash } = await connection.getLatestBlockhash('confirmed');

    // 5) Build the real send transaction with the net amount
    const sendTx = new Transaction({
      feePayer: kp.publicKey,
      recentBlockhash: sendBlockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: kp.publicKey,
        toPubkey: destPubkey,
        lamports: lamportsToSend,
      })
    );

    // 6) Sign, send, and confirm
    sendTx.sign(kp);
    const raw = sendTx.serialize();
    const sig = await connection.sendRawTransaction(raw);
    await connection.confirmTransaction(sig, 'confirmed');

    console.log(
      `  ↳ Sent ${(lamportsToSend / LAMPORTS_PER_SOL).toFixed(6)} SOL — sig ${sig}`
    );
  }

  console.log('Consolidation complete.');
}

(async () => {
  const mnemonic = process.env.MNEMONIC;
  const destination = process.env.DESTINATION_ADDRESS;

  if (!mnemonic) {
    console.error('❌ Please set MNEMONIC in your .env');
    process.exit(1);
  }
  if (!destination) {
    console.error('❌ Please set DESTINATION_ADDRESS in your .env');
    process.exit(1);
  }

  // Sweep the first 5 derived accounts; increase if you need more
  await consolidateTo(mnemonic, destination, 5);
})();
