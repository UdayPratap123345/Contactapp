import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

let db = openDatabase({ name: 'UserDatabase.db' });

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchContacts();
  }, [isFocused]);

  const fetchContacts = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_user ORDER BY firstname ASC',
        [],
        (tx, res) => {
          let temp = [];
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          setContacts(temp);
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const navigateToUpdateContact = (item) => {
    navigation.navigate('UpdateContactList', { data: item });
  };
  const AddButton = () => {
    const navigation = useNavigation();
  
    const navigateToAddUser = () => {
      navigation.navigate('AddUser');
    };
  
    return (
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddUser}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const navigateToFavouriteContacts = () => {
    navigation.navigate('FavouriteContact');
  };

  const renderContactItem = ({ item }) => {
    const isFavorite = item.favourite === 1; // Assuming `favorite` field indicates whether the contact is a favorite
  
    return (
      <TouchableOpacity style={styles.contactItem} onPress={() => navigateToUpdateContact(item)}>
        <View style={styles.contactItem}>
          <Image
            source={{ uri: item.image }}
            style={styles.contactImage}
          />
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.firstname} {item.lastname}</Text>
            <Text style={styles.contactPhone}>{item.phonenumner}</Text>
          </View>
          {isFavorite && (
            <Text style={styles.favoriteIcon1}>❤️</Text>
          )}
          <View style={styles.chevronContainer}>
            <Image
              source={require('./image.png')}
              style={styles.chevron}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filterContacts = () => {
    return contacts.filter(contact => {
      const fullName = `${contact.firstname} ${contact.lastname}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Contact List</Text>
        <TouchableOpacity style={styles.headerButton} onPress={navigateToFavouriteContacts}>
          <Text style={styles.headerButtonText}>Favourite</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Contacts"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filterContacts()}
        renderItem={renderContactItem}
        keyExtractor={item => item.user_id.toString()}
        style={{ width: '100%' }}
      />
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 20,
    height: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    width: 20,
    height: 20,
    tintColor: 'yellow', 
    marginLeft: 20,// Adjust the color if needed
  },
  favoriteIcon1: {
    fontSize: 20,
    color: 'red', // Adjust the color if needed
    marginRight: 10,
  },
});

export default ContactList;
