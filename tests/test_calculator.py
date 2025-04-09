import unittest
from flask import json
from src.app import app
import math

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_basic_operations(self):
        """Test basic arithmetic operations"""
        test_cases = [
            ('2 + 2', '4'),
            ('10 - 5', '5'),
            ('4 * 3', '12'),
            ('15 / 3', '5'),
            ('2 ^ 3', '8'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['result'], expected)

    def test_scientific_functions(self):
        """Test scientific calculator functions"""
        test_cases = [
            ('sin(0)', '0'),
            ('cos(0)', '1'),
            ('sqrt(16)', '4'),
            ('log10(100)', '2'),
            ('abs(-5)', '5'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['result'], expected)

    def test_financial_functions(self):
        """Test financial calculator functions"""
        test_cases = [
            ('compound_interest(1000, 0.05, 1)', '1051.16'),
            ('roi(1500, 1000)', '50'),
            ('simple_interest(1000, 0.05, 1)', '1050'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['result'], expected)

    def test_enhanced_loan_functions(self):
        """Test enhanced loan calculator functions"""
        test_cases = [
            # Test loan comparison
            ('loan_comparison(100000, [4.5, 5.0], [30, 15])[0]["monthly_payment"]', '506.69'),
            ('loan_comparison(100000, [4.5, 5.0], [30, 15])[1]["monthly_payment"]', '790.79'),

            # Test extra payment impact
            ('extra_payment_impact(100000, 4.5, 30, 100)["months_saved"]', '37'),

            # Test refinance analysis
            ('refinance_analysis(80000, 6.0, 25, 4.5, 30, 3000)["monthly_savings"]', '126.6'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(float(response.json['result']),
                                 float(expected),
                                 places=2)

    def test_investment_functions(self):
        """Test investment calculator functions"""
        test_cases = [
            # Test portfolio return
            ('portfolio_return([10000, 5000], [0.07, 0.03])', '5.67'),

            # Test portfolio risk
            ('portfolio_risk([0.1, 0.2], [0.6, 0.4])', '0.14'),

            # Test tax equivalent yield
            ('tax_equivalent_yield(3.5, 25)', '4.67'),

            # Test dollar cost averaging
            ('dollar_cost_averaging(100, 500, 12, 7)["difference_percent"]', '3.31'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(float(response.json['result']),
                                 float(expected),
                                 places=2)

    def test_retirement_functions(self):
        """Test retirement calculator functions"""
        test_cases = [
            # Test retirement savings goal
            ('retirement_savings_goal(30, 65, 90, 50000, 2.5, 6)', '1250000'),

            # Test withdrawal analysis
            ('withdrawal_analysis(1000000, 40000, 2.5, 5, 30)["success"]', 'True'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            if expected in ['True', 'False']:
                self.assertEqual(response.json['result'], expected)
            else:
                self.assertAlmostEqual(float(response.json['result']),
                                     float(expected),
                                     places=2)

    def test_business_valuation_functions(self):
        """Test business valuation functions"""
        test_cases = [
            # Test DCF valuation
            ('dcf_valuation([100000, 120000, 150000, 180000, 220000], 12)', '631944.44'),

            # Test comparable valuation
            ('comparable_valuation(1000000, 100000, 200000, {"revenue": 2, "earnings": 15, "ebitda": 8})', '2500000'),

            # Test startup valuation
            ('startup_valuation(50000, 20, 100000, 5)["valuation"]', '3600000'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(float(response.json['result']),
                                 float(expected),
                                 places=2)

    def test_array_operations(self):
        """Test array calculations"""
        test_cases = [
            ('mean([1, 2, 3, 4, 5])', '3'),
            ('median([1, 2, 3, 4, 5])', '3'),
            ('stdev([1, 2, 3, 4, 5])', '1.58'),
        ]

        for expression, expected in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(float(response.json['result']),
                                 float(expected),
                                 places=2)

    def test_error_handling(self):
        """Test error cases"""
        test_cases = [
            'invalid_function()',
            '1 / 0',
            'sqrt(-1)',
            'log(0)',
            '[1, 2] + 3',
        ]

        for expression in test_cases:
            response = self.app.post('/api/calculate',
                json={'expression': expression})
            self.assertEqual(response.status_code, 400)
            self.assertIn('error', response.json)

    def test_memory_operations(self):
        """Test calculator memory functions"""
        # First store a value
        response = self.app.post('/api/calculate',
            json={'expression': '5'})
        self.assertEqual(response.json['result'], '5')

        # Test memory operations
        memory_tests = [
            ('M+', '5'),  # Add to memory
            ('MR', '5'),  # Recall memory
            ('M-', '0'),  # Subtract from memory
            ('MC', '0'),  # Clear memory
        ]

        for op, expected in memory_tests:
            response = self.app.post('/api/calculate',
                json={'expression': op})
            self.assertEqual(response.json['result'], expected)