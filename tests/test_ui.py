import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestUI(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()  # or webdriver.Chrome()
        self.driver.get('http://localhost:5000')

    def tearDown(self):
        self.driver.quit()

    def test_calculator_input(self):
        """Test calculator UI interactions"""
        # Navigate to calculator
        self.driver.find_element(By.LINK_TEXT, 'Tools').click()
        
        # Test number buttons
        for i in range(10):
            self.driver.find_element(By.ID, f'btn-{i}').click()
        
        # Test operators
        operators = ['+', '-', '*', '/']
        for op in operators:
            self.driver.find_element(By.ID, f'btn-{op}').click()
        
        # Test calculation
        expression = self.driver.find_element(By.ID, 'expression')
        self.assertTrue(len(expression.get_attribute('value')) > 0)
        
        # Test clear button
        self.driver.find_element(By.ID, 'btn-clear').click()
        self.assertEqual(expression.get_attribute('value'), '')

    def test_guide_system(self):
        """Test calculator guide system"""
        self.driver.find_element(By.LINK_TEXT, 'Tools').click()
        
        # Open compound interest guide
        self.driver.find_element(By.CLASS_NAME, 'help-icon').click()
        
        # Check guide content
        guide = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'guide-modal'))
        )
        self.assertIn('Compound Interest', guide.text)