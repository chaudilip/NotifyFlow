import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, HttpMessage } from "@notifyflow/shared-types";
import jwt from "jsonwebtoken";

export const requireAuth = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
       const authHeader = req.headers.authorization;
       
       if(!authHeader?.startsWith("Bearer ")){
         throw new UnauthorizedError(HttpMessage.UNAUTHORIZED)
       }

       const token = authHeader.split(' ')[1]

       if(!token){
         throw new UnauthorizedError(HttpMessage.UNAUTHORIZED)
       }
       
       //verify and decode the token
       const payload =  jwt.verify(
        token,
        process.env.JWT_SECRET!
       ) as {tenantId:string, email:string} 

       req.user = {
            tenantId: payload.tenantId,
            email: payload.email
       }

       next()
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            next(new UnauthorizedError(HttpMessage.TOKEN_EXPIRED))
            return
        } 

        if(error instanceof jwt.JsonWebTokenError){
            next(new UnauthorizedError(HttpMessage.UNAUTHORIZED))
            return
        }

        next(error)
    }
}


