import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { IAuthOptions } from './iauth-options';
import { TokenUtils } from './token-utils';

@Global()
@Module({ providers: [], exports: [] })
export class OidcUtilsModule {
  static IAuthOptionsProvider = (options): ValueProvider => {
    return {
      provide: IAuthOptions,
      useValue: options,
    };
  };

  static forRootAsync(options: IAuthOptions): DynamicModule {
    return {
      module: OidcUtilsModule,
      providers: [TokenUtils, OidcUtilsModule.IAuthOptionsProvider(options)],
      exports: [TokenUtils],
    };
  }
}
