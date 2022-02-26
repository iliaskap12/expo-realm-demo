import React, { useState, useEffect } from 'react';
import { TextInput, Button, Linking } from 'react-native';
import { useLinks } from '../providers/LinksProvider';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../stylesheet';
import Logout from '../components/Logout';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LinksView () {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [linkDescription, setLinkDescription] = useState('');
  const [linkURL, setLinkURL] = useState('');
  const { links, createLink, deleteLink, closeRealm } = useLinks();

  const onClickLink = link => {
    Linking.openURL(link.url).catch(err =>
      console.error('An error occurred: ', err)
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Log Out',
      headerLeft: () => <Logout closeRealm={closeRealm} />
    });
  }, [navigation]);

  useEffect(() => {
    console.log(JSON.stringify(links, null, 2));
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title>Create new Link</ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <>
            <TextInput
              style={styles.input}
              onChangeText={setLinkDescription}
              placeholder='Description'
              value={linkURL}
            />
            <TextInput
              style={styles.input}
              onChangeText={setLinkURL}
              placeholder='URL'
              value={linkURL}
            />
            <Button
              title='Add link!'
              color='red'
              onPress={() => {
                createLink(linkDescription, linkURL);
              }}
            />
          </>
        </ListItem.Accordion>

        {links.map((link, index) => (
          <ListItem.Swipeable
            onPress={() => onClickLink(link)}
            bottomDivider
            key={index}
            rightContent={
              <Button title='Delete' onPress={() => deleteLink(link)} />
            }
          >
            <ListItem.Content>
              <ListItem.Title>{link.name}</ListItem.Title>
              <ListItem.Subtitle>{link.url}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
