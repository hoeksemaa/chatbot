#!/bin/bash 

## USAGE: User provides path to file that needs to checked for bad reads. 
##  Script will output files in the same directory
## EXAMPLE: generate_bad_reads_summary_param.sh filename

BODY=$1

curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d "{
    \"model\": \"claude-haiku-4-5-20251001\",
    \"max_tokens\": 1000,
    \"messages\": [
      {
        \"role\": \"user\", 
        \"content\": \"$BODY\"
      }
    ]
  }"