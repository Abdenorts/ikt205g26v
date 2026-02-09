package com.example.fastnotes.viewmodel

import com.example.fastnotes.data.NotesRepository
import com.example.fastnotes.model.Note
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class NotesViewModel(
    private val repo: NotesRepository = NotesRepository()
) {
    private val _notes = MutableStateFlow<List<Note>>(emptyList())
    val notes: StateFlow<List<Note>> = _notes.asStateFlow()

    private var nextId: Int = 1

    init{ _notes.value = repo.getAll() }

    fun addNote(title: String, content: String) {
        val note = Note(
            id = nextId,
            title = title,
            content = content
        )
        nextId++

        repo.add(note)
        _notes.value = repo.getAll()
    }

    fun getNoteById(id: Int): Note? {
        return repo.getById(id)
    }

}