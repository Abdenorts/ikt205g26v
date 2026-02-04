import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { getNotes, Note } from "../src/NotesStore";



export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
 useFocusEffect( 
  useCallback(() => { setNotes(getNotes()); 
  }, []) 
);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello FastNotes</Text>
        <Link href="/new-note" style={styles.button}>
        New note
        </Link>

      {notes.map((n) => (
        <Link 
        key={n.id} href={`/note/${n.id}`} style={styles.button}>
          {n.title}
          </Link>
      ))}


      <Link href="/new-note" style={styles.button}>
        Go to note.
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
