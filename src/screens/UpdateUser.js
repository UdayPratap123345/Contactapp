import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

let db = openDatabase({ name: 'UserDatabase.db' });

const UpdateContactList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phonenumner, setPhoneNumber] = useState('');
  const [favourite, setFavourite] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (route.params && route.params.data) {
      const { firstname, lastname, phonenumner, favourite, image } = route.params.data;
      setFirstName(firstname);
      setLastName(lastname);
      setPhoneNumber(phonenumner);
      setFavourite(favourite);
      setImage(image);
    }
  }, [route.params]);

  const updateUser = () => {
    if (!firstname || !lastname || !phonenumner || !image) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_user set firstname=?, lastname=?, phonenumner=?, favourite=?, image=? where user_id=?',
        [firstname, lastname, phonenumner, favourite, image, route.params.data.user_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ContactList'),
                },
              ],
              { cancelable: false },
            );
          } else alert('Updation Failed');
        },
      );
    });
  };

  const deleteContact = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM table_user WHERE user_id=?',
        [route.params.data.user_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('ContactList'),
                },
              ],
              { cancelable: false },
            );
          } else alert('Deletion Failed');
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

  const toggleFavorite = () => {
    setFavourite(favourite === 0 ? 1 : 0); // Toggle between 0 and 1
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.deleteBtn} onPress={deleteContact}>
        <Text style={styles.btnText}>Delete User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateBtn} onPress={updateUser}>
        <Text style={styles.btnText}>Update User</Text>
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
  deleteBtn: {
    backgroundColor: '#FF6B6B',
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  updateBtn: {
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

export default UpdateContactList;
