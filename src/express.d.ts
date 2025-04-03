// src/express.d.ts

import { User } from './user/entities/user.entity'; // Assure-toi d'importer correctement ton entité User

declare global {
  namespace Express {
    interface Request {
      user: User; // Déclare que la propriété 'user' existe sur 'Request' et est de type 'User'
    }
  }
}
