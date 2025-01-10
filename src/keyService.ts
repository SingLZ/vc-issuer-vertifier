import * as transmute from '@transmute/verifiable-credentials';

export type keyOutput = {
    privateKey: Uint8Array
    publicKey: Uint8Array
}



import { SupportedSignatureAlgorithms } from '@transmute/verifiable-credentials';



export const alg: SupportedSignatureAlgorithms = 'ES256';

export const generateKeyPairs = async () : Promise<keyOutput> => {
    //const decoder = new TextDecoder("utf-8");

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

    return { privateKey: privateKey, publicKey: publicKey}

}