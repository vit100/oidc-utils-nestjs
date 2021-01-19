export class IAuthOptions {
  /**
   * @param authority Authority URI or well-known
   */
  authority: string;
  /**
   * @param clientId OIDC client ID
   */
  clientId: string;

  /**
   * @param clientSecret OIDC client secret
   */
  clientSecret: string;
}
