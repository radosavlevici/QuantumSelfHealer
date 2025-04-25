#!/bin/bash

# Add copyright information at the top of the script
echo "/**"
echo " * !!! DNA PROTECTED SCRIPT - DO NOT COPY !!!"
echo " * Copyright © Ervin Remus Radosavlevici (01/09/1987)"
echo " * Email: ervin210@icloud.com"
echo " *"
echo " * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0 - WORKFLOW UTILITY"
echo " * This script is protected by DNA-based security and is part of"
echo " * the unified protection system."
echo " */"
echo

echo "Terminating any processes using port 5003..."

# Find the process ID (PID) of the process using port 5003
PID=$(lsof -i:5003 -t)

if [ -z "$PID" ]; then
    echo "No process is currently using port 5003."
else
    echo "Found process $PID using port 5003. Terminating..."
    # Kill the process
    kill -9 $PID
    echo "Process terminated successfully."
fi

echo "Port 5003 is now free for use."
echo
echo "© Ervin Remus Radosavlevici (01/09/1987) - All rights reserved."