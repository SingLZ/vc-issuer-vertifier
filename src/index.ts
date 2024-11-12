// Import the required module
import * as transmute from '@transmute/verifiable-credentials';

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

const decoder = new TextDecoder("utf-8");
const alg = 'ES256';

async function generateKeyPairs() {
    const privateKey = await transmute.key.generate({
    alg,
    type: "application/jwk+json",
    });
  // console.log(new TextDecoder().decode(privateKey))
  // {
  //   "kid": "xSgm4GQOT_ZyYFApew0GnRvPWt70omVJV9XVB5tsmN8",
  //   "alg": "ES256",
  //   "kty": "EC",
  //   "crv": "P-256",
  //   "x": "XRkZngz2KSCrLdXKGCRNyDzBgsovioZIqMWnF42nmdg",
  //   "y": "H2t6Xxdg8p8Cqn2-hsuWnXYj0192He4zTZghAxNXllo",
  //   ...
  // }

  // Output the private key
  console.log(decoder.decode(privateKey));

  const publicKey = await transmute.key.publicFromPrivate({
    type: "application/jwk+json",
    content: privateKey,
  });
  // console.log(new TextDecoder().decode(publicKey))
  // {
  //   "kid": "xSgm4GQOT_ZyYFApew0GnRvPWt70omVJV9XVB5tsmN8",
  //   "alg": "ES256",
  //   "kty": "EC",
  //   "crv": "P-256",
  //   "x": "XRkZngz2KSCrLdXKGCRNyDzBgsovioZIqMWnF42nmdg",
  //   "y": "H2t6Xxdg8p8Cqn2-hsuWnXYj0192He4zTZghAxNXllo",
  // }
  
 console.log(decoder.decode(publicKey));
}

generateKeyPairs();
