import { Request, Response } from 'express';
import { UserService } from './user.service.js';

export const getProfileDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profileData = await UserService.getFullDashboard(userId);
    
    if (!profileData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: profileData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const updatedUser = await UserService.updateDetails(userId, req.body);
    
    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      data: updatedUser 
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleBotMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { userId, name } = (req as any).user;
    
    // Delegate all business logic to the service
    const reply = await UserService.processBotMessage(userId, name, message);
    
    res.status(200).json({ success: true, reply });
  } catch (error: any) {
    res.status(500).json({ reply: "Service is temporarily unavailable." });
  }
};