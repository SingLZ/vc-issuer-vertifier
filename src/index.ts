// Import the required module
import * as transmute from '@transmute/verifiable-credentials';
import * as jose from 'jose'
import { generateKeyPairs, alg } from './keyService.ts';
// Define types for the Verifiable Credential structure
interface CredentialSubject {
  id: string;
  alumniOf: string;
}

interface VerifiableCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: CredentialSubject;
}

const statusListSize = 131072;
const revocationIndex = 94567;
const suspensionIndex = 23452;

const issuer = `did:example:123`;
const baseURL = `https://vendor.example/api`;

const issuerSigner = {
  sign: async (bytes: Uint8Array) => {
    const jws = await new jose.CompactSign(bytes)
      .setProtectedHeader({ kid: `${issuer}#key-42`, alg })
      .sign(
        await transmute.key.importKeyLike({
          type: "application/jwk+json",
          content: (await generateKeyPairs()).privateKey,
        })
      );
    return transmute.text.encoder.encode(jws);
  },
};