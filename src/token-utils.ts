import { Inject, Injectable } from '@nestjs/common';
import { IAuthOptions } from './iauth-options';
import { Client, Issuer, TokenSet } from 'openid-client';

@Injectable()
export class TokenUtils {
  private discoverPromise = null;
  private tokenPromise: Promise<TokenSet> = null;
  private initialized = false;

  constructor(private _options: IAuthOptions) {
    if (_options.authority && _options.clientId && _options.clientSecret) {
      this.initialized = true;
    } else {
    }
  }

  async discoAsync(): Promise<Issuer<Client>> {
    if (!this.initialized) {
      this.initErrorMessage();
      return;
    }

    if (this.discoverPromise) {
      return await this.discoverPromise;
    }
    this.discoverPromise = Issuer.discover(this._options.authority);
    return await this.discoverPromise;
  }

  async tokenAsync() {
    if (!this.initialized) {
      this.initErrorMessage();
      return;
    }

    if (this.tokenPromise) {
      const tokenSet1 = await this.tokenPromise;
      if (tokenSet1.expired()) {
        this.tokenPromise = null;
        this.tokenAsync();
      }
      return tokenSet1;
    }

    const issuer = await this.discoAsync();
    const client = new issuer.Client({
      client_id: this._options.clientId,
      client_secret: this._options.clientSecret,
    });
    this.tokenPromise = client.grant({
      grant_type: 'client_credentials',
      scope: 'openid',
    });

    const tokenSet = await this.tokenPromise;

    return tokenSet;
  }

  async authHeaderAsync(): Promise<string> {
    if (!this.initialized) {
      this.initErrorMessage();
      return;
    }

    const tokenSet = await this.tokenAsync();
    return `Authorization: Bearer ${tokenSet.access_token}`;
  }

  private initErrorMessage() {
    console.log(`Module hasn't initialized. Required config param(s) missed.`);
  }
}
