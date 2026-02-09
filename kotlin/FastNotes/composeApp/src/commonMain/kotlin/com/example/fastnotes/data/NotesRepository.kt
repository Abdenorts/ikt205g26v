package com.example.fastnotes.data
import com.example.fastnotes.model.Note

class NotesRepository {
    private val notes = mutableListOf<Note>()

    fun getAll(): List<Note> = notes
    fun add(note: Note) { notes.add(note) }
    fun getById(id: Int): Note? = notes.firstOrNull { it.id == id }

}