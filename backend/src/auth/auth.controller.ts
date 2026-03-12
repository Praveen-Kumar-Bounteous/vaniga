import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { setAuthCookies, clearAuthCookies, verifyRefreshToken } from '../utils/jwt.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.signup(req.body);
    res.status(201).json({ success: true, message: "User registered", data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);
    
    setAuthCookies(res, accessToken, refreshToken);
    
    res.status(200).json({ success: true, message: "Logged in successfully", data: user });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const { accessToken, refreshToken } = await AuthService.refresh(token);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error: any) {
    res.status(403).json({ success: false, message: "Session expired" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // 1. Decode the token to get the userId
      const decoded = verifyRefreshToken(token);
      
      if (decoded && decoded.userId) {
        // 2. Remove the refresh token from the Database
        await AuthService.logout(decoded.userId);
      }
    }

    // 3. Clear the cookies from the browser regardless of token validity
    clearAuthCookies(res);

    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully from all sessions" 
    });
  } catch (error: any) {
    // Even if DB fails, we usually want to clear cookies to "log out" the UI
    clearAuthCookies(res);
    res.status(500).json({ 
      success: false, 
      message: "Error during logout, but session cleared localy" 
    });
  }
};