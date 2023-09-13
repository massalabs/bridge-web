export enum FAQsections {
  getTokens = 'getTokens',
  addTokens = 'addTokens',
}

export enum FAQcategories {
  getEthOnSep = 'getEthOnSep',
  getWethAndtDai = 'getWethAndtDai',
  getMasOnMassa = 'getMasOnMassa',
  addToMassa = 'addToMassaWellet',
  addToMetamask = 'addToMetamask',
}

export const faqURL = {
  faq: `?section=faq`,
  getTokens: {
    base: `?section=getTokens`,
    getEthOnSep: `?section=getTokens&category=${FAQcategories.getEthOnSep}`,
    getWethAndtDai: `?section=getTokens&category=${FAQcategories.getWethAndtDai}`,
    getMasOnMassa: `?section=getTokens&category=${FAQcategories.getMasOnMassa}`,
  },
  addTokens: {
    base: `?section=addTokens`,
    addToMassa: `?section=addTokens&category=${FAQcategories.addToMassa}`,
    addToMetamask: `?section=addTokens&category=${FAQcategories.addToMetamask}`,
  },
};

export interface FAQProps {
  category: string | null;
}
