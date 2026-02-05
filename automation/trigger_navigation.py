import time
try:
    import undetected_chromedriver as uc
except ImportError:
    import subprocess
    print("Installing undetected-chromedriver...")
    subprocess.check_call(["pip", "install", "undetected-chromedriver"])
    import undetected_chromedriver as uc

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def launch_recruiter_portal():
    """
    Connects to the launcher's browser and navigates to the search page.
    """
    print("Initializing connection to Chrome on port 9222...")
    options = uc.ChromeOptions()
    
    # This port MUST match the one used by your launcher/browser
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    try:
        # Note: When attaching to an existing browser, use driver_executable_path if needed, 
        # but usually uc.Chrome() handles it if version matches.
        # Since we are attaching, we don't spawn a new process, we just attach.
        driver = uc.Chrome(options=options)
        print(f"Connected to browser: {driver.title}")

        # 1. Force navigation to the Recruiter Dashboard
        print("Navigating to Recruiter Login/Home...")
        driver.get("https://recruit.naukri.com/recruit/login")
        
        # 2. Use LLM Data to 'Detect' the next step
        # We wait for the 'RESDEX' menu to be clickable
        wait = WebDriverWait(driver, 20)
        
        print("Waiting for RESDEX link...")
        resdex_menu = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "RESDEX")))
        
        print("Recruiter page detected. Moving to Search...")
        resdex_menu.click()
        
        # 3. Navigate directly to Advanced Search
        print("Navigating directly to Advanced Search...")
        driver.get("https://resdex.naukri.com/v2/search/advanced")
        
        print("SUCCESS: Recruiter Portal Activated.")
        return True

    except Exception as e:
        print(f"Connection Failed. Ensure Chrome is running with --remote-debugging-port=9222. Error: {e}")
        return False

if __name__ == "__main__":
    launch_recruiter_portal()
