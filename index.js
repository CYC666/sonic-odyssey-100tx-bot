const {
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  Keypair,
} = require('@solana/web3.js');
const fs = require('fs');
const colors = require('colors');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const base58 = require('bs58');
const DEVNET_URL = 'https://devnet.sonic.game/';
const connection = new Connection(DEVNET_URL, 'confirmed');

async function sendSol(fromKeypair) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: fromKeypair.publicKey,
      lamports: 0 * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);
  console.log(colors.green('POST SOL Success:'), signature);
}


function getKeypairFromPrivateKey(privateKeyBase58) {
  const privateKeyBytes = base58.decode(privateKeyBase58);
  const keypair = Keypair.fromSecretKey(privateKeyBytes);
  return keypair;
}

function displayHeader() {
  console.log(colors.magenta('--- Solana Transaction Script ---'));
}

(async () => {
  displayHeader();
  
  let seedPhrasesOrKeys = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
    if (!Array.isArray(seedPhrasesOrKeys) || seedPhrasesOrKeys.length === 0) {
      throw new Error(
        colors.red('privateKeys.json is not set correctly or is empty')
      );
    }

  for (const [index, seedOrKey] of seedPhrasesOrKeys.entries()) {
    let fromKeypair = getKeypairFromPrivateKey(seedOrKey);
    console.log(
      colors.yellow(
        `Kirim SOL Ke Wallet ${
          index + 1
        }: ${fromKeypair.publicKey.toString()}`
      )
    );

    for (let i = 0; i < 110; i++) {
      try {
        await sendSol(fromKeypair);
      } catch (error) {
        console.error(colors.red(`Failed to send SOL to ${address}:`), error);
      }
    }
  }
})();
