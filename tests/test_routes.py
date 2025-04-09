import unittest
from src.app import app

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_page(self):
        """Test home page loads"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Welcome to Web Toolbox', response.data)

    def test_tools_page(self):
        """Test tools page loads"""
        response = self.app.get('/tools')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Calculator', response.data)

    def test_games_page(self):
        """Test games page loads"""
        response = self.app.get('/games')
        self.assertEqual(response.status_code, 200)

    def test_404_handling(self):
        """Test 404 error handling"""
        response = self.app.get('/nonexistent')
        self.assertEqual(response.status_code, 404)