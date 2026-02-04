

export type Note ={
    id: string;
    title: string;
    content: string;
}

let notes: Note[] = [];

export function getNotes(): Note[]{
    return notes;
}

export function addNote(title: string, content: string): string{
    const id = Date.now().toString();
    const note: Note = {id, title, content};
    notes = [note, ...notes];
    return id;
}

export function getNoteById(id: string): Note | undefined {
    return notes.find((n) => n.id === id);
}