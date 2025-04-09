from flask import Blueprint, render_template

games_bp = Blueprint('games', __name__)

@games_bp.route('/games')
def games():
    games_list = [
        {
            'name': 'Tic Tac Toe',
            'description': 'Classic game of X\'s and O\'s',
            'url': '/games/tictactoe'
        },
        {
            'name': 'Snake',
            'description': 'Classic snake game',
            'url': '/games/snake'
        }
    ]
    return render_template('games.html', games=games_list)