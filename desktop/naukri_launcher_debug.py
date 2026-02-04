from pywinauto import Desktop
import subprocess
import time

print("STEP 0: Script started")

from pywinauto import Desktop
import subprocess
import time

print("STEP 1: Imports done")

exe_path = r"C:\Program Files\Naukri Launcher\Naukri Launcher.exe"

print("STEP 2: Launching launcher")
subprocess.Popen([exe_path])

time.sleep(20)

print("STEP 3: Enumerating windows")

windows = Desktop(backend="uia").windows()
print(f"STEP 4: Total windows found = {len(windows)}")

found = False

for w in windows:
    try:
        title = w.window_text()
        print("WINDOW TITLE:", title)

        if "naukri" in title.lower():
            found = True
            print("\n===== NAUKRI WINDOW FOUND =====")
            w.set_focus()
            time.sleep(1)
            w.print_control_identifiers()
    except Exception as e:
        print("Error reading window:", e)

if not found:
    print("STEP 5: NO NAUKRI WINDOWS FOUND")

input("DONE. Press Enter to exit...")

