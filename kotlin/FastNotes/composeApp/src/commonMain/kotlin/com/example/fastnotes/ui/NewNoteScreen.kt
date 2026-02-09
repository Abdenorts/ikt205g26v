package com.example.fastnotes.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.imePadding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun NewNoteScreen(
    onSave: (title: String, content: String) -> Unit,
    onCancel: () -> Unit,
) {
    var title by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }

    Column( modifier= Modifier
        .fillMaxSize()
        .padding(16.dp)
        .imePadding()){
        Text(text = "New Note")

        OutlinedTextField(
            value = title,
            onValueChange = { title = it },
            label = { Text(text = "Title") },
            modifier = Modifier.padding(top = 12.dp)
        )

        OutlinedTextField(
            value = content,
            onValueChange = { content = it },
            label = { Text("Content") },
            modifier = Modifier
                .padding(top = 12.dp)
                .fillMaxWidth()
                .weight(1f),
            singleLine = false,
            maxLines = Int.MAX_VALUE
        )

        Button(
            onClick = { onSave(title, content) },
            modifier = Modifier.padding(top = 12.dp)
        ){
            Text(text = "Save")
        }

    }
}
