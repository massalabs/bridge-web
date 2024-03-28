export enum FAQsections {
  getTokens = 'getTokens',
  addTokens = 'addTokens',
  bridgeWmas = 'bridgeWmas',
}

export enum FAQcategories {
  getEthOnSep = 'getEthOnSep',
  getWethAndtDai = 'getWethAndtDai',
  getMasOnMassa = 'getMasOnMassa',
  addToMassa = 'addToMassaWallet',
  addToMetamask = 'addToMetamask',
  bridgeWmas = 'bridgeWmas',
}

export const faqURL = {
  buildnet: {
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
  },
  mainnet: {
    addTokens: {
      addToMassa: `?section=addTokens&category=${FAQcategories.addToMassa}`,
    },
    bridgeWmas: {
      bridgeWmas: `?section=bridgeWmas&category=${FAQcategories.bridgeWmas}`,
    },
  },
};

export interface FAQProps {
  category: string | null;
}

export const bridgeTutorialLink = undefined;

export const bridgeUrl = 'https://bridge.massa.net/index';

export const bridgeEmail = 'support.bridge@massa.net';

export const discordSupportChannel = undefined;
