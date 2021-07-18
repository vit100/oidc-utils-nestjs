import { Injectable } from '@nestjs/common';
import { Client, Issuer, TokenSet } from 'openid-client';
import { IAuthOptions } from './iauth-options';

@Injectable()
export class TokenUtils {
  private _discoverPromise = null;
  private _tokenPromise: Promise<TokenSet> = null;
  private _initialized = false;
  private _scheduleRefreshTimeoutHandler: NodeJS.Timeout;
  private _options: IAuthOptions;

  constructor(options: IAuthOptions) {
    const defaultOptions: IAuthOptions = {
      authority: null,
      clientId: null,
      clientSecret: null,
      refreshBeforeExpire: 30,
      logActivity: false,
    };
    this._options = Object.assign({}, defaultOptions, options);
    if (options.authority && options.clientId && options.clientSecret) {
      this._initialized = true;
    }
  }

  async discoAsync(): Promise<Issuer<Client>> {
    if (!this._initialized) {
      this.initErrorMessage();
      return;
    }

    this.logMessage('Requesting discovery data.');

    if (this._discoverPromise) {
      return await this._discoverPromise;
    }
    try {
      this._discoverPromise = Issuer.discover(this._options.authority);
    } catch (error) {
      this.logMessage(`Unable to discover. Error: ${error}`);
      throw error;
    }
    return await this._discoverPromise;
  }

  async tokenAsync() {
    if (!this._initialized) {
      this.initErrorMessage();
      return;
    }

    let tokenSet: TokenSet;

    if (this._tokenPromise) {
      tokenSet = await this._tokenPromise;
      if (tokenSet.expired()) {
        this.logMessage(`expired at${tokenSet.expires_at} getting new one. ${Date()}`);
        this._tokenPromise = null;
        var newTokenSet: TokenSet = await this.tokenAsync();
        this.logMessage(`new token expire at ${newTokenSet.expires_at}`);
        return newTokenSet;
      }
      return tokenSet;
    } else {
      const issuer = await this.discoAsync();
      const client = new issuer.Client({
        client_id: this._options.clientId,
        client_secret: this._options.clientSecret,
      });
      this._tokenPromise = client.grant({
        grant_type: 'client_credentials',
        scope: 'openid',
      });

      tokenSet = await this._tokenPromise;

      if (this._options.refreshBeforeExpire != 0) {
        this.scheduleTokenRefresh(
          (tokenSet.expires_at - Math.floor(Date.now() / 1000) - this._options.refreshBeforeExpire) * 1000,
        );
      }

      this.logMessage(`Tokenset received sucessfully.`);
      return tokenSet;
    }
  }

  async authHeaderAsync(): Promise<string> {
    if (!this._initialized) {
      this.initErrorMessage();
      return;
    }

    const tokenSet = await this.tokenAsync();
    return `Authorization: Bearer ${tokenSet.access_token}`;
  }

  private initErrorMessage() {
    this.logMessage(`Module hasn't initialized. Required config param(s) missed.`);
  }

  private scheduleTokenRefresh(t_ms) {
    this.logMessage(`Refresh for next token scheduled in ${t_ms/1000} sec.`)
    if (this._scheduleRefreshTimeoutHandler) {
      clearTimeout(this._scheduleRefreshTimeoutHandler);
    }
    this._scheduleRefreshTimeoutHandler = setTimeout(() => {
      this.logMessage('Scheduled token refresh invoked.');
      this._tokenPromise = null;
      this.tokenAsync(); //kick in new refresh
    }, t_ms);
  }

  private logMessage(msg) {
    if (this._options.logActivity) {
      console.log(`oidc-utils-nestjs: ${msg}`);
    }
  }
}
