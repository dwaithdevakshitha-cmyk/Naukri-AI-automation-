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
    Connects to the launcher's browser and navigates to the Recruiter Dashboard.
    """
    print("Initializing connection to Chrome on port 9222...")
    options = uc.ChromeOptions()
    options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    
    try:
        # Force version 144 to match Naukri Launcher's internal browser
        driver = uc.Chrome(options=options, version_main=144)
        print(f"Connected to browser: {driver.title}")
        
        # Force Focus
        try:
            driver.minimize_window()
            driver.maximize_window()
        except:
            pass

        # 1. Force navigation to the Recruiter Dashboard
        # print("Redirecting to Naukri Recruiter Dashboard...")
        # driver.get("https://recruit.naukri.com/recruit/login")
        
        # 2. Wait for page load
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        print("SUCCESS: Connected to Naukri Launcher (Navigation Disabled).")
        return True

    except Exception as e:
        print(f"Navigation Error: {e}")
        return False

if __name__ == "__main__":
    launch_recruiter_portal()
