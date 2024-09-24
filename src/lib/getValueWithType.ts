import { sysVarConfiguration } from "@/sysVarConfiguration";

type TValue<T extends keyof typeof sysVarConfiguration> = 
  T extends "op_list" ? string[] | undefined : string | number | undefined;


export function getValueWithType(key: "op_list", value?: string[] | undefined): string[] | undefined;
export function getValueWithType(key: keyof typeof sysVarConfiguration, value?: string | number | undefined): string | number | undefined;

export function getValueWithType<T extends keyof typeof sysVarConfiguration>(
  key: T, 
  value?: string[] | number | string | undefined
): TValue<T> {
  if (key === "op_list") {
    return value as TValue<T>;
  } else {
    return value as TValue<T>;
  }
}
