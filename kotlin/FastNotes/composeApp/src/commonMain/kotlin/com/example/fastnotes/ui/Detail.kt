package com.example.fastnotes.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.fastnotes.model.Note


@Composable
fun NoteDetailScreen(
    note: Note?,
    onBack: () -> Unit,
) {
    Box(modifier = Modifier.fillMaxSize()) {

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Text(text = "Detail page")

            if (note == null) {
                Text(text = "Note not found", modifier = Modifier.padding(12.dp))
                return
            } else {
                Text(text = note.title, modifier = Modifier.padding(12.dp))
                Text(text = note.content, modifier = Modifier.padding(8.dp))
            }
        }

            FloatingActionButton(
                onClick = onBack,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(16.dp)
            ) {
                Text("Back")
            }
        }
    }
