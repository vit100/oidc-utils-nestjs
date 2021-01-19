import { Test, TestingModule } from '@nestjs/testing';
import { IAuthOptions } from './iauth-options';
import { TokenUtils } from './token-utils';

describe('Token', () => {
  let provider: TokenUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenUtils, IAuthOptions],
    }).compile();

    provider = module.get<TokenUtils>(TokenUtils);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
