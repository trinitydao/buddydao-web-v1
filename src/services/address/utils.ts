import { utils } from 'ethers';

export function addressTextOverflow(address: string | undefined, { start = 6, end = 4 } = {}) {
  if (!address || !utils.isAddress(address)) return address;

  const length = address.length;
  return `${address.slice(0, start)}...${address.slice(length - end, length)}`;
}
