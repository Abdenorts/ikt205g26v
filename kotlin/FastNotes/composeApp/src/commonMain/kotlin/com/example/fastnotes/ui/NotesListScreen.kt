package com.example.fastnotes.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Card
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.fastnotes.model.Note
import com.example.fastnotes.viewmodel.NotesViewModel

@Composable
fun NotesListScreen(
    viewModel: NotesViewModel,
    onNoteSelected: (Int) -> Unit,
    onAddNote: () -> Unit
) {
    val notes by viewModel.notes.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Text(text = "Notes")

            if (notes.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(
                    text = "No notes added, press + to add a note.",
                    fontSize = 18.sp
                )}
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(12.dp),
                ) {
                    items(notes) { note ->
                        NoteRow(
                            note = note,
                            onClick = { onNoteSelected(note.id) },
                        )
                    }
                }
            }
        }
            FloatingActionButton(
                onClick = { onAddNote() },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
            ) {
                Text("+")
            }
        }
    }

@Composable
private fun NoteRow(
    note: Note,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
        .fillMaxWidth()
        .padding(vertical = 8.dp)
        .clickable { onClick() }
    ) {
        Text(
            text = note.title,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            fontSize = 18.sp,
            textAlign = TextAlign.Center
        )
    }
}

