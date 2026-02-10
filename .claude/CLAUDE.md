# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an early-stage chatbot project by John Hoeksema. Currently contains a proof-of-concept shell script for interacting with the Claude API.

## Current Architecture

**curl-claude.sh**: Basic shell script that sends messages to Claude API
- Uses Claude Haiku 4.5 model (`claude-haiku-4-5-20251001`)
- Takes a message as first argument: `./curl-claude.sh "your message here"`
- Requires `ANTHROPIC_API_KEY` environment variable to be set
- Makes direct HTTP POST to `https://api.anthropic.com/v1/messages`
- Returns raw JSON response from the API

## Development Setup

Set your API key as an environment variable:
```bash
export ANTHROPIC_API_KEY="your-key-here"
```

Run the script:
```bash
./curl-claude.sh "Hello, Claude!"
```

Note: The script currently has a variable expansion issue - the `$BODY` variable in the JSON payload needs proper escaping.

## Project Stage

This is a very early-stage project with minimal functionality. The Node.js .gitignore suggests plans to evolve into a JavaScript/TypeScript application, but no Node.js code exists yet.
