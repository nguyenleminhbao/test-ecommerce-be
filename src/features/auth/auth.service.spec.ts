import { PrismaService } from 'src/database/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let prismaService: PrismaService;
  let authService: AuthService;

  const mockUserId = 'user_2g8BPBrfavROni4ysDkHRuJJTCH';
  const mockCheckLoginResponse = {
    id: 'e5b4a6b8-4e09-4d8e-8c86-e07513610bf9',
    name: 'Nguyễn Lê Minh Bảo',
    email: 'nguyenleminhbaott5@gmail.com',
    password: '',
    phone: '0398841279',
    address: '',
    avatar:
      'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZzhCUEJZMEtGUGVlaVk5NXNvNFo2cTFldVEifQ',
    createdAt: '2024-05-08T07:17:47.573Z',
    updatedAt: '2024-05-08T07:17:47.573Z',
    firstName: 'Nguyễn Lê Minh',
    lastName: 'Bảo',
    status: 'ACTIVE',
    type: 'GITHUB',
    role: 'ADMIN_SHOP',
  };

  const mockLoginResponse = {
    type: 'Success',
    code: 200,
    message: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YjRhNmI4LTRlMDktNGQ4ZS04Yzg2LWUwNzUxMzYxMGJmOSIsIm5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCBC4bqjbyIsImVtYWlsIjoibmd1eWVubGVtaW5oYmFvdHQ1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiIiwicGhvbmUiOiIwMzk4ODQxMjc5IiwiYWRkcmVzcyI6IiIsImF2YXRhciI6Imh0dHBzOi8vaW1nLmNsZXJrLmNvbS9leUowZVhCbElqb2ljSEp2ZUhraUxDSnpjbU1pT2lKb2RIUndjem92TDJsdFlXZGxjeTVqYkdWeWF5NWtaWFl2YjJGMWRHaGZaMjl2WjJ4bEwybHRaMTh5WnpoQ1VFSlpNRXRHVUdWbGFWazVOWE52TkZvMmNURmxkVkVpZlEiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJmaXJzdE5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCIsImxhc3ROYW1lIjoiQuG6o28iLCJzdGF0dXMiOiJBQ1RJVkUiLCJ0eXBlIjoiR0lUSFVCIiwicm9sZSI6IkFETUlOX1NIT1AiLCJpYXQiOjE3MTkzOTMwNzIsImV4cCI6MTcxOTQ3OTQ3Mn0.3o3ZlfBxSOvfRUpD08_ZEybXtIr7DEKyFPOv2yykNMw',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1YjRhNmI4LTRlMDktNGQ4ZS04Yzg2LWUwNzUxMzYxMGJmOSIsIm5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCBC4bqjbyIsImVtYWlsIjoibmd1eWVubGVtaW5oYmFvdHQ1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiIiwicGhvbmUiOiIwMzk4ODQxMjc5IiwiYWRkcmVzcyI6IiIsImF2YXRhciI6Imh0dHBzOi8vaW1nLmNsZXJrLmNvbS9leUowZVhCbElqb2ljSEp2ZUhraUxDSnpjbU1pT2lKb2RIUndjem92TDJsdFlXZGxjeTVqYkdWeWF5NWtaWFl2YjJGMWRHaGZaMjl2WjJ4bEwybHRaMTh5WnpoQ1VFSlpNRXRHVUdWbGFWazVOWE52TkZvMmNURmxkVkVpZlEiLCJjcmVhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTA1LTA4VDA3OjE3OjQ3LjU3M1oiLCJmaXJzdE5hbWUiOiJOZ3V54buFbiBMw6ogTWluaCIsImxhc3ROYW1lIjoiQuG6o28iLCJzdGF0dXMiOiJBQ1RJVkUiLCJ0eXBlIjoiR0lUSFVCIiwicm9sZSI6IkFETUlOX1NIT1AiLCJpYXQiOjE3MTkzOTMwNzIsImV4cCI6MTcxOTY1MjI3Mn0.BxYvJzvHRmvv5yR2vCaKwocuabPA0kJggPsc3rTrE6c',
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

  const mockFindFirstUser = {
    id: 'e5b4a6b8-4e09-4d8e-8c86-e07513610bf9',
    name: 'Nguyễn Lê Minh Bảo',
    email: 'nguyenleminhbaott5@gmail.com',
    password: '',
    phone: '0398841279',
    address: '',
    avatar:
      'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZzhCUEJZMEtGUGVlaVk5NXNvNFo2cTFldVEifQ',
    createdAt: '2024-05-08T07:17:47.573Z',
    updatedAt: '2024-05-08T07:17:47.573Z',
    firstName: 'Nguyễn Lê Minh',
    lastName: 'Bảo',
    status: 'ACTIVE',
    type: 'GITHUB',
    role: 'ADMIN_SHOP',
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
  };

  const mockAuthService = {
    checkLogin: jest.fn().mockReturnValue(mockCheckLoginResponse),
    generateAccessToken: jest
      .fn()
      .mockReturnValue(mockLoginResponse.message.accessToken),
    generateRefreshToken: jest
      .fn()
      .mockReturnValue(mockLoginResponse.message.refreshToken),
    login: jest.fn().mockReturnValue(mockLoginResponse),
    getMe: jest.fn().mockReturnValue(mockGetMeResponse),
  };

  const mockPrismaService = {
    findFirst: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    // Login successfully
    it('should login successfully', async () => {
      const expectedOutput = await authService.login({
        userId: mockUserId,
      });

      expect(expectedOutput).toEqual(mockLoginResponse);
    });
  });

  describe('get-me', () => {
    // Get me successfully
    it('should get me successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockReturnValue(mockFindFirstUser as any);

      const expectedOutput = await authService.getMe(mockUserId);

      console.log(expectedOutput);
      expect(expectedOutput).toEqual(mockGetMeResponse);
    });
  });
});
