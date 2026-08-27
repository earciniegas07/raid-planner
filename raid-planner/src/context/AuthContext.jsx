import { createContext, useState } from 'react';
import { initialUsers } from '../data/mockData';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialUsers[0]);

  const switchUser = (userId) => {
    const user = initialUsers.find(u => u.id === Number(userId));
    if (user) setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, users: initialUsers }}>
      {children}
    </AuthContext.Provider>
  );
}