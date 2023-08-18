const baseURL = import.meta.env.VITE_BASE_URL;

export enum FAQsections {
  getTokens = 'getTokens',
  addTokens = 'addTokens',
}

export enum FAQcategories {
  getEthOnSep = 'getEthOnSep',
  getWethAndtDai = 'getWethAndtDai',
  getXmaOnMassa = 'getXmaOnMassa',
  addToMassa = 'addToMassaWellet',
  addToMetamask = 'addToMetamask',
}

export const faqURL = {
  faq: `${baseURL}?section=faq`,
  getTokens: {
    base: `${baseURL}?section=getTokens`,
    getEthOnSep: `${baseURL}?section=getTokens&category=${FAQcategories.getEthOnSep}`,
    getWethAndtDai: `${baseURL}?section=getTokens&category=${FAQcategories.getWethAndtDai}`,
    getXmaOnMassa: `${baseURL}?section=getTokens&category=${FAQcategories.getXmaOnMassa}`,
  },
  addTokens: {
    base: `${baseURL}?section=addTokens`,
    addToMassa: `${baseURL}?section=addTokens&category=${FAQcategories.addToMassa}`,
    addToMetamask: `${baseURL}?section=addTokens&category=${FAQcategories.addToMetamask}`,
  },
};

export function isEqual(value1: string | null, value2: string) {
  return value1 === value2;
}

export interface FAQProps {
  category: string | null;
}
