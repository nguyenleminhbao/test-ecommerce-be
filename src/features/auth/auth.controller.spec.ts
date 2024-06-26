import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUserId = 'user_2g8BPBrfavROni4ysDkHRuJJTCH';
  const mockLoginResponse = {
    type: 'Success',
    code: 200,
    message: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YjRhNmI4LTRlMDktNGQ4ZS04Yzg2LWUwNzUxMzYxMGJmOSIsIm5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCBC4bqjbyIsImVtYWlsIjoibmd1eWVubGVtaW5oYmFvdHQ1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiIiwicGhvbmUiOiIwMzk4ODQxMjc5IiwiYWRkcmVzcyI6IiIsImF2YXRhciI6Imh0dHBzOi8vaW1nLmNsZXJrLmNvbS9leUowZVhCbElqb2ljSEp2ZUhraUxDSnpjbU1pT2lKb2RIUndjem92TDJsdFlXZGxjeTVqYkdWeWF5NWtaWFl2YjJGMWRHaGZaMjl2WjJ4bEwybHRaMTh5WnpoQ1VFSlpNRXRHVUdWbGFWazVOWE52TkZvMmNURmxkVkVpZlEiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJmaXJzdE5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCIsImxhc3ROYW1lIjoiQuG6o28iLCJzdGF0dXMiOiJBQ1RJVkUiLCJ0eXBlIjoiR0lUSFVCIiwicm9sZSI6IkFETUlOX1NIT1AiLCJpYXQiOjE3MTkzODM5ODMsImV4cCI6MTcxOTQ3MDM4M30.IQVmWFUO0JlCwu_EmBcHCuGv-1KfpAcdUFMdYBJT2u0',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YjRhNmI4LTRlMDktNGQ4ZS04Yzg2LWUwNzUxMzYxMGJmOSIsIm5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCBC4bqjbyIsImVtYWlsIjoibmd1eWVubGVtaW5oYmFvdHQ1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiIiwicGhvbmUiOiIwMzk4ODQxMjc5IiwiYWRkcmVzcyI6IiIsImF2YXRhciI6Imh0dHBzOi8vaW1nLmNsZXJrLmNvbS9leUowZVhCbElqb2ljSEp2ZUhraUxDSnpjbU1pT2lKb2RIUndjem92TDJsdFlXZGxjeTVqYkdWeWF5NWtaWFl2YjJGMWRHaGZaMjl2WjJ4bEwybHRaMTh5WnpoQ1VFSlpNRXRHVUdWbGFWazVOWE52TkZvMmNURmxkVkVpZlEiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJmaXJzdE5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCIsImxhc3ROYW1lIjoiQuG6o28iLCJzdGF0dXMiOiJBQ1RJVkUiLCJ0eXBlIjoiR0lUSFVCIiwicm9sZSI6IkFETUlOX1NIT1AiLCJpYXQiOjE3MTkzODM5ODMsImV4cCI6MTcxOTY0MzE4M30.h8PREU75DCVliEQNE9F9jnN5zqsJ_AS8wjMwK-GsDhM',
    },
  };

  const mockGetMeResponse = {
    type: 'Success',
    code: 200,
    message: {
      id: 'e5b4a6b8-4e09-4d8e-8c86-e07513610bf9',
      name: 'Nguyễn Lê Minh Bảo',
      firstName: 'Nguyễn Lê Minh',
      lastName: 'Bảo',
      phoneNumber: '0398841279',
      addresses: [
        {
          id: 'a9fe6fd7-63bd-4f12-a912-8bf37c1f2330',
          userId: 'e5b4a6b8-4e09-4d8e-8c86-e07513610bf9',
          createdAt: '2024-06-14T09:09:25.070Z',
          updatedAt: '2024-06-14T09:09:25.070Z',
          city: 'Tp Ho Chi Minh',
          streetAddress: '12 Dong Khoi, Quan 1',
        },
      ],
      avatar:
        'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZzhCUEJZMEtGUGVlaVk5NXNvNFo2cTFldVEifQ',
    },
  };

  const mockAuthService = {
    login: jest.fn().mockReturnValue(mockLoginResponse),
    getMe: jest.fn().mockReturnValue(mockGetMeResponse),
    refreshToken: jest.fn().mockReturnValue(mockLoginResponse),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Login
  it('login', async () => {
    const expectedOutput = await authController.login({
      userId: mockUserId,
    });

    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockLoginResponse);
  });

  // Get me
  it('get-me', async () => {
    const expectedOutput = await authController.getMe(mockUserId);

    expect(authService.getMe).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockGetMeResponse);
  });

  // Refresh token
  it('refresh-token', async () => {
    const expectedOutput = await authController.refreshToken({
      refreshToken: 'refresh token',
    });

    expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockLoginResponse);
  });
});
