import { isValidAddress } from '@/utils/isValidAddress';
import type { Envs } from './types';

const IsTestNet = process.env.NEXT_PUBLIC_TESTNET === 'true';

// BuddyDaoAddress
const BuddyDaoAddressEnv =
  (IsTestNet ? process.env.NEXT_PUBLIC_TESTNET_BUDDYDAO_ADDRESS : process.env.NEXT_PUBLIC_BUDDYDAO_ADDRESS) ?? '';
const BuddyDaoAddressEnvKey = IsTestNet ? 'NEXT_PUBLIC_TESTNET_BUDDYDAO_ADDRESS' : 'NEXT_PUBLIC_BUDDYDAO_ADDRESS';

// Tokens
const TokensEnv = IsTestNet ? process.env.NEXT_PUBLIC_TESTNET_TOKENS : process.env.NEXT_PUBLIC_TOKENS;
const TokensEnvKey = IsTestNet ? 'NEXT_PUBLIC_TESTNET_TOKENS' : 'NEXT_PUBLIC_TOKENS';

if (!isValidAddress(BuddyDaoAddressEnv)) {
  throw new Error(`${BuddyDaoAddressEnvKey} invalid`);
}

const Tokens = parseTokens(TokensEnv);

export const envs: Envs = {
  IsTestNet,
  BuddyDaoAddress: BuddyDaoAddressEnv,
  Tokens,
};

console.info(`envs: ${JSON.stringify(envs, null, 2)}`);

function parseTokens(tokensStr?: string): Envs['Tokens'] {
  if (!tokensStr) throw new Error(`${TokensEnvKey} is not exist`);

  const arr = tokensStr.split(',');

  return arr
    .map((item, index) => {
      if (!item) return;

      const [label, address, more] = item.split('@');

      if (!label || !address || more)
        throw new Error(`${TokensEnvKey} ${index + 1} item invalid, "${item}", example: USDT@0x55fdfsdfs...`);

      if (!isValidAddress(address)) throw new Error(`${TokensEnvKey} ${index + 1} item address invalid: "${item}"`);

      const xx: Envs['Tokens'][0] = {
        label,
        address,
      };
      return xx;
    })
    .filter(((v) => !!v) as <T>(value: T) => value is NonNullable<T>);
}
