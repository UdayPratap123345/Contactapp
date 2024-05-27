import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

// Open or create the database
let db = openDatabase({ name: 'UserDatabase.db' });

// Define the FavoriteScreen component
const FavoriteScreen = () => {
  const [favoriteContacts, setFavoriteContacts] = useState([]);
  const navigation = useNavigation();

  // Fetch favorite contacts from the database upon component mount
  useEffect(() => {
    fetchFavoriteContacts();
  }, []);

  // Function to fetch favorite contacts from the database
  const fetchFavoriteContacts = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_user WHERE favourite = 1 ORDER BY firstname ASC',
        [],
        (tx, res) => {
          let temp = [];
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          setFavoriteContacts(temp);
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  // Render each favorite contact item
  const renderFavoriteContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.contactImage}
      />
      <View>
        <Text>{item.firstname} {item.lastname}</Text>
        <Text>{item.phonenumner}</Text>
      </View>
      <Text style={styles.favoriteIcon1}>❤️</Text>
    </View>
  );

  // Function to navigate back to ContactList screen
  

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteContacts}
        renderItem={renderFavoriteContactItem}
        keyExtractor={item => item.user_id.toString()}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    borderRadius: 25, // To make the image circular
    marginRight: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2196F3', // Material blue color
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  favoriteIcon1: {
    fontSize: 20,
    color: 'red', // Adjust the color if needed
    marginLeft: 20,
  },
});

// Export the FavoriteScreen component
export default FavoriteScreen;
