import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

let db = openDatabase({ name: 'UserDatabase.db' });

const AddUser = () => {
  const navigation = useNavigation();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phonenumner, setPhoneNumber] = useState('');
  const [favourite, setFavourite] = useState(0);
  const [image, setImage] = useState(null);

  const saveUser = () => {
    console.log(firstname, lastname, phonenumner, favourite,image);
    if (!firstname || !lastname || !phonenumner || !image) {
      Alert.alert(
        'Missing Information',
        'Please fill in all details.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
      return; // Exit the function if any field is empty
    }
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (firstname, lastname, phonenumner, favourite, image) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, phonenumner, favourite, image],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Added Contact Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ContactList'),
                },
              ],
              { cancelable: false },
            );
          } else alert('Added Contact Failed');
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
    }).catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, firstname VARCHAR(20), lastname VARCHAR(50), phonenumner VARCHAR(20), favourite INTEGER, image TEXT)',
              [],
            );
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  }, []);

  const toggleFavorite = () => {
    setFavourite(favourite === 0 ? 1 : 0); // Toggle between 0 and 1
  };
  const navigateToContactList = () => {
    navigation.navigate('ContactList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add User</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.imagePickerBtn} onPress={selectImage}>
        <Text style={styles.btnText}>Select Image</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={firstname}
        onChangeText={txt => setFirstName(txt)}
      />
      <TextInput
        placeholder="Last Name"
        value={lastname}
        onChangeText={txt => setLastName(txt)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phonenumner}
        onChangeText={txt => setPhoneNumber(txt)}
        style={styles.input}
      />
      <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
        <Text style={styles.btnText}>{favourite === 1 ? 'Unmark Favorite' : 'Mark Favorite'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveBtn} onPress={saveUser}>
        <Text style={styles.btnText}>Save User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 15,
    marginBottom: 20,
  },
  imagePickerBtn: {
    backgroundColor: '#6C63FF',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteBtn: {
    backgroundColor: '#FCA542',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});

export default AddUser;
