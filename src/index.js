import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

function Square(props) {
    return (
        <button
            className="square"
            onClick={() => { props.onClick() }}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    render() {
        const squaresList = this.props.squares.map((item, index) => {
            return (
                <Square
                    key={index}
                    value={this.props.squares[index]}
                    onClick={() => { this.props.onClick(index) }}
                />
            );
        })

        return (
            <div className="game-board">
                {squaresList}
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const stepNumber = this.state.stepNumber;
        const history = this.state.history.slice(0, stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();


        if (calculateWinner(squares) || squares[i] || stepNumber >= 9) return;

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const stepNumber = this.state.stepNumber;
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Перейти к ходу #' + move :
                'К началу игры';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;

        if (winner) {
            status = 'Выйграл: ' + winner;
        }
        else if (stepNumber >= 9) {
            status = 'Ничья !';
        }
        else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />

                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
