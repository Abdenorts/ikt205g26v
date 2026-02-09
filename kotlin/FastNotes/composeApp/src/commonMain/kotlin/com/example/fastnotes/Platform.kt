package com.example.fastnotes

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform