declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      nik: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
