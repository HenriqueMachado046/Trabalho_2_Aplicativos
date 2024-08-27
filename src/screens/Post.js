import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { TextInput, Button } from 'react-native-paper';


const Post = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user, userToken } = useContext(AuthContext);

    const handleCreatePost = async () => {
        if (!title || !content) {
            alert('Title and Content are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/posts', {
                title,
                content,
                user_id: user.id,
            }, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Post created:', response.data);
            navigation.navigate('Home'); 
        } catch (error) {
            console.error('Error creating post:', error.response ? error.response.data : error.message);
            alert('Error creating post. Please try again.');
        }
    };

    return (

        <View style={styles.container}>
            <TextInput
                label="Título"
                style={styles.input}
                mode='flat'
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                lable="Post"
                style={styles.input}
                mode='flat'
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
            />
            <Button mode ='contained' onPress={handleCreatePost}>Postar</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      marginBottom: 20,
    },
    button: {
        marginTop: 20,
        padding: 10,
    },
  });

export default Post;
