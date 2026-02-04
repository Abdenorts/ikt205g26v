import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
    title: string;
    onPress: () => void;
}

const NoteCard = ({ title, onPress}: Props) => {
    return (
        <Pressable
            style={styles.card}
            onPress={onPress}
            android_ripple={{ color: '#ccc'}}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10
    },
    text: { fontSize: 16},
});

export default NoteCard;