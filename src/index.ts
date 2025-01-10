// Import the required module
import * as transmute from '@transmute/verifiable-credentials';
import * as jose from 'jose'
import { generateKeyPairs, alg } from './keyService';
import { issued } from './issuerService'
import voterClaim from './vc/voterRegistration.json';

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

// Generate key pairs
let privateKey: any, publicKey: any;
async function initializeKeys() {
  ({ privateKey, publicKey } = await generateKeyPairs());
}

//This is the signature (object) of the issuer
const issuerSigner = {
  sign: async (bytes: Uint8Array) => {
    const jws = await new jose.CompactSign(bytes)
      .setProtectedHeader({ kid: `${issuer}#key-42`, alg })
      .sign(
        await transmute.key.importKeyLike({
          type: "application/jwk+json",
          content: privateKey,
        })
      );
    return transmute.text.encoder.encode(jws);
  },
};

///////////////////////////////// Issue VC ///////

// Define Request Object
const request = {
    alg,
    type: "application/vc-ld+jwt" as transmute.SupportedJwtSignatureFormats,
    signer: issuerSigner,
  };

// Convert JSON object to Uint8Array
const jsonString = JSON.stringify(voterClaim);
const encoder = new TextEncoder();
const contentUint8Array = encoder.encode(jsonString);


// Call the issued function directly and handle the promise
// issued(request, contentUint8Array)
//   .then(signedVC => {
//     console.log('Signed VC:', signedVC);
//   })
//   .catch(error => {
//     console.error('Error issuing VC:', error);
//   });



// Async function to handle the promise
async function issueVC() {
  try {
    const signedVC = await issued(request, contentUint8Array);
    console.log('Signed VC:', signedVC); //This siged result is a signed JSON Web Signature (JWS) in the form of Uint8Array
    console.log('Decoded Signed VC:', new TextDecoder().decode(signedVC)); //JWS in serialized form

    // Verify and decode the JWS serialization to get the original JSON object
    const decodedSignedVC = new TextDecoder().decode(signedVC);
    const { payload } = await jose.compactVerify(decodedSignedVC, await transmute.key.importKeyLike({
      type: 'application/jwk+json',
      content: publicKey,
    }));
    const originalJson = JSON.parse(new TextDecoder().decode(payload));
    console.log('Original JSON:', originalJson);

  } catch (error) {
    console.error('Error issuing VC:', error);
  }
}
// Call the async function
initializeKeys().then(() => {
  issueVC();
});