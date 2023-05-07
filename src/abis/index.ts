import type { BigNumber } from 'ethers';
import type { Get } from 'type-fest';

// type MyNames = AbiName<Abi>;
// type MyFunction = ApiFunction<Abi, 'NewTrust'>;
// type MyArgs = AbiArgs<Abi, 'NewTrust'>;
// type MyParams = AbiParams<Abi, 'NewTrust'>;

type GetName<T> = T extends { name: infer U } ? U : never;
export type AbiName<T extends readonly unknown[]> = GetName<T[number]>;

type GetFunction<T, Name> = T extends { name: Name } ? T : never;
export type ApiFunction<T extends readonly unknown[], Name extends AbiName<T>> = GetFunction<T[number], Name>;

type GetFunctionArgs<T> = T extends { inputs: infer U } ? (U extends readonly unknown[] ? U : never) : never;
export type AbiArgs<T extends readonly unknown[], Name extends AbiName<T>> = GetFunctionArgs<ApiFunction<T, Name>>;

type ValueType<T> = T extends 'string'
  ? string
  : T extends `uint${256}`
  ? BigNumber
  : T extends 'address'
  ? `0x${string}`
  : any;
type GetArgName<T> = T extends `_${infer U}` ? U : T extends string ? T : never;
type ArgsToParams<Args extends readonly unknown[]> = {
  [K in keyof Args]: {
    name: GetArgName<Get<Args[K], 'name'>>;
    value: ValueType<Get<Args[K], 'type'>>;
  };
};
export type AbiParams<T extends readonly unknown[], Name extends AbiName<T>> = ArgsToParams<AbiArgs<T, Name>>;

export type AbiObjectParams<T extends readonly unknown[], Name extends AbiName<T>> = {
  [K in keyof AbiParams<T, Name>]: AbiParams<T, Name>[K]['value'];
};

export function mapValue<T extends readonly { value: any }[]>(args: T) {
  return args.map((arg) => arg.value) as { [K in keyof T]: T[K]['value'] };
}
