import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { IAuthOptions } from './iauth-options';
import { TokenUtils } from './token-utils';

@Global()
@Module({ providers: [TokenUtils, IAuthOptions], exports: [TokenUtils, IAuthOptions] })
export class OidcUtilsModule {
  static IAuthOptionsProvider = (options): ValueProvider => {
    return {
      provide: IAuthOptions,
      useValue: options,
    };
  };

  static forRoot(options: IAuthOptions): DynamicModule {
    return {
      module: OidcUtilsModule,
      providers: [OidcUtilsModule.IAuthOptionsProvider(options)],
    };
  }
}
