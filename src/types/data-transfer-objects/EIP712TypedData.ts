interface TypeField {
  name: string;
  type: string;
}

interface Domain {
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
  salt: string;
}

export interface EIP712TypedData {
  types: {
    EIP712Domain: TypeField[];
    [k: string]: TypeField[];
  };
  domain: Domain;
  primaryType: string;
  message: {
    [k: string]: string | number;
  };
}
