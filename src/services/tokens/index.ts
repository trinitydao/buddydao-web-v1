import { Tokens } from '@/envs';
export const tokens = Tokens;

export function getTokenName(address: `0x${string}`) {
  return tokens.find((token) => token.address === address)?.label;
}
