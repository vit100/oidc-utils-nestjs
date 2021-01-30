# Library or util classes to work with OIDC protocol

## TokenUtils class

Used to get OIDC JWT token from authority with `client_credentials`grant type and `oidc` scope.

## Other classes coming later



## How to install

1.  Install npm package:

    `npm install oidc-utils-nestjs`

2.  Import module into your appication

        ```
        // app.module.ts
        import { OidcUtilsModule } from 'oidc-utils-nestjs';
        ```

    3 Register module import and `LoggingInterceptor` provider

        @Module({
          imports: [
                OidcUtilsModule.forRootAsync({
                  authority: 'https://yourOIDCAuthority/', // or well-know
                  clientId: '<CLIENT_ID>',
                  clientSecret: '<CLIENT_Secret>',
                  refreshBeforeExpire: 30 // Refresh token before it expired. Optional value. Default: 30 sec. Value 0 - means don't  refresh it automatically.
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
  getHello(): string {
    return await this._tokenUtils.authHeaderAsync();
  }
```

### API:

#### TokenUtils

returns discovery data from your authority. See well-known spec

    discoAsync(); 

return valid (not expired) [TokenSet]("https://github.com/panva/
    node-openid-client/blob/main/docs/README.md#tokenset")

    tokenAsync();

  returns string ready for http client header = `Bearer eyJhbGciOiJSUzI1NiIsIn....`

    authHeaderAsync();
}


---

Work in progress!!!
Will add more methods later.