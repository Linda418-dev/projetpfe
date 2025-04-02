// src/express.d.ts

import { User } from './user/entities/user.entity'; // Importer ton modèle d'utilisateur

declare global {
  namespace Express {
    interface Request {
      user: User; // Déclare ici que 'request.user' est un objet de type 'User'
    }
  }
}
