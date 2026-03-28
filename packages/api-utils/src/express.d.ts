declare global {
  namespace Express {
    interface Request {
      user?: {
        tenantId: string;
        email: string;
      };
      tenant?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}


export {}