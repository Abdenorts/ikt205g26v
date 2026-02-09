package com.example.fastnotes

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.example.fastnotes.ui.NotesListScreen
import com.example.fastnotes.ui.NewNoteScreen
import com.example.fastnotes.viewmodel.NotesViewModel
import com.example.fastnotes.ui.NoteDetailScreen

private enum class Screen { List, NewNote, Detail }
@Composable
fun App() {
    val viewModel = remember { NotesViewModel() }

    var screen by remember { mutableStateOf(Screen.List) }
    var selectedNoteId by remember { mutableStateOf<Int?>(null) }

    when (screen) {
        Screen.List -> {
                NotesListScreen(
                    viewModel = viewModel,
                    onNoteSelected = { id ->
                        selectedNoteId = id
                        screen = Screen.Detail
                    },
                    onAddNote = { screen = Screen.NewNote },
                )
            }

        Screen.NewNote -> {
            NewNoteScreen(
                onSave = { title, content ->
                    viewModel.addNote(title, content)
                    screen = Screen.List
                },
                { screen = Screen.List }
            )
        }

        Screen.Detail -> {
            val note = selectedNoteId?.let { viewModel.getNoteById(it) }

            NoteDetailScreen(
                note = note,
                onBack = { screen = Screen.List },
            )
        }
    }
}

