import { utils } from 'ethers';

export function isValidAddress(value: string): value is `0x${string}` {
  return value?.length === 42 && utils.isAddress(value);
}
