@echo off
REM filepath: e:\Asvix\Medibot\Medibot-AI\User-Interface\ml-service\start_service.bat

echo Checking if Ollama is running...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Starting Ollama...
    start /B ollama serve
    timeout /t 5 /nobreak > NUL
)

echo Checking required models...
ollama list | findstr "llama3.2" > NUL
if "%ERRORLEVEL%"=="1" (
    echo Pulling llama3.2 model...
    ollama pull llama3.2
)

ollama list | findstr "nomic-embed-text" > NUL
if "%ERRORLEVEL%"=="1" (
    echo Pulling nomic-embed-text model...
    ollama pull nomic-embed-text
)

echo Starting Medical Chatbot Service...
python medical_chatbot_service.py