import appConfig from "@/appConfig";
import { encodeData } from "./encodeData";

const suffixes = {
  livenet: "",
  testnet: "-tn",
};

const suffix = suffixes[appConfig?.TESTNET ? "testnet" : "livenet"];

interface IGenerateLink {
  amount: number;
  aa: string;
  asset?: string;
  data: {
    [key: string]: any;
  };
  from_address?: string;
  is_single?: boolean;
}

export const generateLink = ({ amount, data, from_address, aa, asset = "base", is_single }: IGenerateLink) => {
  let link = `obyte${suffix}:${aa}?amount=${Math.round(amount)}&asset=${encodeURIComponent(asset)}`;
  const encodedData = encodeData(data);

  if (data && encodedData !== null) link += "&base64data=" + encodeURIComponent(encodedData);
  if (from_address) link += "&from_address=" + encodeURIComponent(from_address);
  if (is_single) link += "&single_address=1";
  return link;
};


interface IGenerateSysLink {
	from_address?: string;
  is_single?: boolean;
	app?: 'system_vote' | 'system_vote_count';
	param_key: string;
	value?: string | number;
}

export const generateSysLink = ({ app = 'system_vote', param_key, from_address, is_single, value }: IGenerateSysLink) => {
  let link = `obyte${suffix}:data?app=${app}&subject=${param_key}&value=${encodeURIComponent(value)}`;
	
  if (from_address) link += "&from_address=" + encodeURIComponent(from_address);

  if (is_single) link += "&single_address=1";
  return link;
};
