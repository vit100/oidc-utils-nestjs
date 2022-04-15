# Library or util classes to work with OIDC protocol

## TokenUtils class

Used to get OIDC JWT token from authority with `client_credentials`grant type and `oidc` scope.

## How to install

1.  Install npm package:

    `npm install oidc-utils-nestjs`

2.  Import module into your appication

        ```
        // app.module.ts
        import { OidcUtilsModule } from 'oidc-utils-nestjs';
        ```

    3 Register module import `OidcUtilsModule.forRootAsync`

        @Module({
          imports: [
                OidcUtilsModule.forRoot({
                  authority: 'https://yourOIDCAuthority/', // or well-know
                  clientId: '<CLIENT_ID>',
                  clientSecret: '<CLIENT_Secret>',
                  refreshBeforeExpire: 30, // Refresh token before it expired in sec. Optional value. Default: 30 sec. Value 0 - means don't  refresh it automatically.
                  logActivity: false, // Log debug messages into console. Optional value. Default: false
                }),
          ],
        })
        export class AppModule {}
        ```

This module will 'provide' `TokenUtils` class.

## How to use

In your consumer class register DI `TokenUtils` (via constructor or other way) and use TokenUtils instance methods in your class functions:

```
@Controller()
export class AppController {
  constructor(private _tokenUtils: TokenUtils,) {}

  @Get()
  async getHello(): string {
    const token = await this._tokenUtils.tokenAsync(); //valid access token. You don't need to check validity explicitly
    const discoveryInfo = await this._tokenUtils.discoAsync(); // your IDP well-known
    const httpHeader = await this._tokenUtils.authHeaderAsync(); //this will return HTTP auth header with valid token.
  }
```

### API:

#### TokenUtils

    discoAsync();
Returns discovery data from your authority. See well-known spec. 
  

    tokenAsync();
Returns valid (not expired) [TokenSet]("https://github.com/panva/node-openid-client/blob/main/docs/README.md#tokenset")


    authHeaderAsync();
Returns string ready for http client header = `Bearer eyJhbGciOiJSUzI1NiIsIn....`

