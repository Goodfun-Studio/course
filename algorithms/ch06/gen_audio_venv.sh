#!/bin/bash
set -e
VENV=/Users/ivywu/.clawd/users/owner-b5acc56e-7791-4ec2-b14c-ff40685359e1/.venv-tts
source $VENV/bin/activate
python3 generate_audio.py
deactivate
