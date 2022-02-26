import app from '../RealmApp';
import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  const realmRef = useRef(null);

  useEffect(() => {
    if (!user) {
      console.warn('No user logged in');
      return;
    }

    const config = {
      sync: {
        user,
        partitionValue: `user=${user.id}`
      }
    };

    Realm.open(config).then(userRealm => {
      realmRef.current = userRealm;
    });

    return () => {
      const userRealm = realmRef.current;
      if (userRealm) {
        userRealm.close();
        realmRef.current = null;
      }
    };
  }, [user]);

  const signIn = async (email, password) => {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credentials);
    setUser(newUser);
  };

  const signUp = async (email, password) => {
    await app.emailPasswordAuth.registerUser({ email, password });
  };

  const signOut = async () => {
    if (user === null) {
      console.warn("Not logged in, can't log out!");
    }
    await user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error('useAuth() called outside of an AuthProvider');
  }
  return auth;
};

export { AuthProvider, useAuth };
