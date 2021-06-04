import gql from 'fake-tag';

export const TokenDetails = gql`
  fragment TokenDetails on Token {
    address: id
    name
    symbol
    decimals
  }
`;

export const InvoiceDetails = gql`
  fragment InvoiceDetails on Invoice {
    id
    address
    network
    token
    client
    provider
    resolverType
    resolver
    resolutionRate
    isLocked
    amounts
    numMilestones
    currentMilestone
    total
    disputeId
    released
    createdAt
    terminationTime
    projectName
    projectDescription
    projectAgreement
    startDate
    endDate
    deposits(orderBy: timestamp, orderDirection: asc) {
      txHash
      sender
      amount
      timestamp
    }
    releases(orderBy: timestamp, orderDirection: asc) {
      txHash
      milestone
      amount
      timestamp
    }
    disputes(orderBy: timestamp, orderDirection: asc) {
      txHash
      ipfsHash
      sender
      details
      timestamp
    }
    resolutions(orderBy: timestamp, orderDirection: asc) {
      txHash
      ipfsHash
      clientAward
      providerAward
      resolutionFee
      timestamp
    }
    tokenMetadata {
      decimals
      symbol
    }
  }
`;
