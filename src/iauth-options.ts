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

  /**
   * @param refreshBeforeExpire Automatically start to refresh token before in expires in refreshBeforeExpire sec. Default=30 sec 
   */
  refreshBeforeExpire?: number = 30

  /**
   * @param log activity into console. Default = false
   */
  logActivity?: boolean = false
}
