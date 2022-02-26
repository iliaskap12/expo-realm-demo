import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';
import { Link } from '../schemas';
import { useAuth } from './AuthProvider';

const LinksContext = React.createContext(null);

const LinksProvider = props => {
  const [links, setLinks] = useState([]);
  const { user } = useAuth();
  const realmRef = useRef(null);

  useEffect(() => {
    if (user === null) {
      console.error('Need logged in user');
      return;
    }

    const OpenRealmBehaviorConfiguration = {
      type: 'openImmediately'
    };

    const config = {
      schema: [Link.schema],
      sync: {
        user: user,
        partitionValue: `${user.id}`,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration
      }
    };

    Realm.open(config).then(realm => {
      realmRef.current = realm;

      const syncLinks = realm.objects('Link');
      const sortedLinks = syncLinks.sorted('name');
      setLinks([...sortedLinks]);

      sortedLinks.addListener(() => {
        console.log('Got new data');
        setLinks([...sortedLinks]);
      });
    });

    return () => {
      closeRealm();
    };
  }, [user]);

  const closeRealm = () => {
    const realm = realmRef.current;
    if (realm) {
      realm.close();
      realm.current = null;
      setLinks([]);
    }
  };

  const createLink = (newLinkName, newLinkUrl) => {
    const realm = realmRef.current;

    realm.write(() => {
      realm.create(
        'Link',
        new Link({
          name: newLinkName || 'New Link',
          url: newLinkUrl || 'http://',
          partition: user.id
        })
      );
    });
  };

  const deleteLink = link => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(link);
      setLinks([...realm.objects('Link').sorted('name')]);
    });
  };

  return (
    <LinksContext.Provider
      value={{
        createLink,
        deleteLink,
        closeRealm,
        links
      }}
    >
      {props.children}
    </LinksContext.Provider>
  );
};

const useLinks = () => {
  const links = useContext(LinksContext);
  if (links === null) {
    throw new Error('useLinks() called outside of a LinksProvider');
  }
  return links;
};

export { LinksProvider, useLinks };
