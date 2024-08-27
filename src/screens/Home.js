import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const { userToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const renderPost = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.content}</Paragraph>
                <Text style={styles.email}>Criado por: {item.email}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPost}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No posts available</Text>}
            />
            <Button
                mode="contained"
                style={styles.button}
                onPress={() => navigation.navigate('Post')}
            >
                Criar novo post
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f3f3f3',
    },
    card: {
        marginBottom: 15,
    },
    email: {
        marginTop: 10,
        fontStyle: 'italic',
        color:'#f3f3f3'
    },
    button: {
        marginTop: 20,
        padding: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default Home;
