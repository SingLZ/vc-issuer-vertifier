import * as transmute from '@transmute/verifiable-credentials';



  export async function issued(request: transmute.RequestCredentialIssuer, content: Uint8Array): Promise<Uint8Array> {

    const signedCredential =  await transmute
        .issuer({
            alg: request.alg,
            type: request.type,
            signer: request.signer
        })
        .issue({
            claimset: content,
            })
    return signedCredential;
}
