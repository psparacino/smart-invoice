import gql from 'fake-tag';

import { clients } from './client';
import { TokenDetails } from './fragments';
import { memoize } from '../utils/memoize';
import { ADDRESS_ZERO } from '../utils/constants';

const tokensQuery = gql`
  query GetTokens {
    tokens {
      ...TokenDetails
    }
  }
  ${TokenDetails}
`;

export const getTokens = memoize(async chainId => {
  const { data, error } = await clients[chainId].query(tokensQuery).toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return [];
  }
  return data.tokens;
});

export const getTokensMap = memoize(async chainId => {
  const tokensList = await getTokens(chainId);
  let tokensMap = {};
  tokensList.forEach(token => {
    tokensMap[token.address] = token;
  });
  return tokensMap;
});

export const getTokenInfo = memoize(async (chainId, tokenAddress) => {
  const tokensMap = await getTokensMap(chainId);
  return (
    tokensMap[tokenAddress] || {
      address: ADDRESS_ZERO,
      name: 'UNKNOWN',
      decimals: 18,
      symbol: 'UNKNOWN',
    }
  );
});
