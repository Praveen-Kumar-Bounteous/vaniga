import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt.js';

export class AuthService {
  static async signup(userData: any) {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true }
    });
  }

  static async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Save refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  static async refresh(token: string) {
    const user = await prisma.user.findFirst({ where: { refreshToken: token } });
    if (!user) throw new Error('Invalid Refresh Token');

    const tokens = generateTokens(user.id, user.role);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return tokens;
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }
}