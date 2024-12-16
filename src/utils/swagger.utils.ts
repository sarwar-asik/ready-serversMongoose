import { UserSchema } from '../app/modules/USER/user.model';
import schemaConverter from './schemaConverter';

export const swaggerTags = [
  {
    name: 'Auth',
    description: '🔐 Included login,signup of admin,user',
  },
  {
    name: 'Super Admin',
    description: '👑 Super admin API design',
  },
  {
    name: 'Admin',
    description: ' Admin Admin Action API',
  },
  {
    name: 'User',
    description: '👤 User profile related API',
  },
];

export const swaggerDefinition = {
  UserSchema: schemaConverter(UserSchema)
};
