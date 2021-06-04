import { Heading, Link, Text, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { CONFIG } from '../config';
import { Container } from '../shared/Container';
import { Loader } from '../components/Loader';
import {
  getAccountString,
  getAddressLink,
  getInvoiceFactoryAddress,
} from '../utils/helpers';
import { getTokens } from '../graphql/tokens';

const { NETWORK_CONFIG } = CONFIG;
const networks = Object.keys(NETWORK_CONFIG);

export const Contracts = () => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const tokenLists = await Promise.all(
        networks.map(chainId => getTokens(chainId)),
      );
      let tokensMap = {};
      networks.forEach((chainId, index) => {
        tokensMap[chainId] = tokenLists[index];
      });
      setTokens(tokensMap);
      setLoading(false);
    };
    load();
  });

  if (loading) {
    return (
      <Container overlay>
        <Loader size="80" />
      </Container>
    );
  }

  return (
    <Container overlay color="white">
      <Heading
        fontWeight="normal"
        mb="1rem"
        mx="1rem"
        textTransform="uppercase"
        textAlign="center"
        color="red.500"
      >
        Contracts
      </Heading>

      {networks.map(chainId => {
        const INVOICE_FACTORY = getInvoiceFactoryAddress(chainId);
        const TOKENS = tokens[chainId];
        return (
          <>
            <Text textAlign="center">NETWORK CHAIN ID: {chainId}</Text>
            <Text textAlign="center">
              INVOICE FACTORY:{' '}
              <Link
                href={getAddressLink(chainId, INVOICE_FACTORY)}
                isExternal
                color="red.500"
              >
                {isSmallScreen
                  ? getAccountString(INVOICE_FACTORY)
                  : INVOICE_FACTORY}
              </Link>
            </Text>
            {TOKENS.map(({ address, symbol }) => (
              <Text textAlign="center" key={address}>
                {`ERC20 TOKEN ${symbol}: `}
                <Link
                  href={getAddressLink(chainId, address)}
                  isExternal
                  color="red.500"
                >
                  {isSmallScreen ? getAccountString(address) : address}
                </Link>
              </Text>
            ))}
            <br />
          </>
        );
      })}
    </Container>
  );
};
