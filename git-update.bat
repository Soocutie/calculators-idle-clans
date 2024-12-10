@echo off
cd /d "C:\Users\Magnu\OneDrive\Desktop\Calculators Idle Clans"
echo Pushing changes to GitHub...
git add .
git commit -m "UPDATED"
git push
if %ERRORLEVEL% EQU 0 (
    echo Push successful! Netlify should start deploying soon.
    echo Check your Netlify dashboard for deployment status.
) else (
    echo Error occurred during push.
)
pause