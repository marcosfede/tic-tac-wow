import React, { Component } from 'react'
//import $ from 'jquery'

import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton';

import './App.css'
import Topbar from './components/Topbar'
import Tile from './components/Tile'

import allianceimg from './images/alliance.png'
import hordeimg from './images/horde.gif'

export default class App extends Component {

  constructor () {
    super()
    this.state = {
      faction: null,
      AIFaction: null,
      tiles : Array(9).fill(''),
      playerTurn: null,
      gameOver: false,
    }
  }

  render () {

    return (
      <div id='App' className='App'>
        <Topbar
          href={'https://github.com/marcosfede/tic-tac-wow'}
          title={'Tic Tac Wow'}
        />
        <div id='content'>
          <Card id='card' zDepth={2}>
            <CardText id='title'>
              Tic Tac Wow
            </CardText>
            <div id="status-buttons">
                {this.renderFactionOrReset()}
            </div>
            <div id="game">
              {this.renderTiles()}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  renderTiles = () => {
    let {tiles} = this.state
    return tiles.map((tile, index) => {
              return <Tile
                      key={index}
                      position={index}
                      value={tile}
                      tileClick={this.tileClick}
                      />
            })
  }

  renderFactionOrReset = () => {
    if (!this.state.faction) {
      // $('#text').slideUp(500)
      // $('#slide').slideDown(500)
      return (
        <div>
        <p> Pick a Faction </p>
        <span>
          <RaisedButton label="Alliance"
            style={{width: "130px", marginRight: '4px'}}
            icon={<img alt="Alliance" style={{height: '25px'}} src={allianceimg}/>}
            onClick={() => this.startGame('a')}  />
          <RaisedButton label="Horde"
            style={{width: "130px", marginLeft: '4px'}}
            icon={<img alt="Alliance" style={{height: '25px'}} src={hordeimg}/>}
            onClick={() => this.startGame('h')} />
        </span>
        </div>
      )
    }
    else {
      return (
        <RaisedButton label="Reset" onClick={this.resetGame} />
      )
    }
  }

  startGame = (faction) => {
    let oppositeFactionDict = { 'a': 'h', 'h': 'a' }
    this.setState({faction: faction, AIFaction: oppositeFactionDict[faction], playerTurn: faction === "a"},
    // AI's turn if player selected Horde
      () => {if (faction === 'h') {this.AIMove()} }
    )
  }

  tileClick = (position) => {
    let {playerTurn, tiles, faction} = this.state
    if (faction !== null && playerTurn && tiles[position]===''){
      let newTiles = [
        ...tiles.slice(0,position),
        faction,
        ...tiles.slice(position+1)
      ]
      this.setState({playerTurn: false, tiles: newTiles }, this.checkWinnerOrContinue)
    }
  }

  resetGame = () => {
    this.setState({faction: null, AIFaction: null, playerTurn: null, tiles: Array(9).fill('')})
  }

  gameFinish = () => {
    window.setTimeout(this.resetGame,1000)
  }
  // checks if the game is over. if its not, invokes AI if playerTurn is false
  checkWinnerOrContinue = () => {
    let {tiles, AIFaction, faction, playerTurn} = this.state
    let {checkWinner, gameFinish, AIMove} = this

    let winner = checkWinner(tiles)
    switch (winner) {
      case faction:
      case AIFaction:
      case 'd':
        this.setState({gameOver: true}, gameFinish)
        break;
      default:
        if (!playerTurn) {
          AIMove()
        }
    }
  }

  AIMove = () => {
    let {tiles, AIFaction} = this.state
    let {minimax, checkWinnerOrContinue} = this

    let AITile = minimax(tiles, true).move
    let newTiles = [
        ...tiles.slice(0,AITile),
        AIFaction,
        ...tiles.slice(AITile+1)
      ]
    this.setState({ tiles: newTiles , playerTurn: true},
    checkWinnerOrContinue)
  }


  /* main minmax algorithm.
  * @param tiles: board state at a certain recursion level
  * @param aiTurn : alternates between true and false, begins at true
  * @return object {score: scorevalue , move: whereshould ai play}
  */
  minimax = (tiles, aiTurn) => {
    /* check if game is over, return 1, -1 or 0
    if not over, getAvailableMoves
    create scores list,  assign the result of  minimax of each available move
    calc max and min from scores list
    if turn = x : return max
    if turn = o : return min
    */
    let {faction , AIFaction} = this.state
    let {checkWinner, getAvailableMoves, virtualMove, minimax} = this
    let scoreOrNotDone = checkWinner(tiles)
    if (scoreOrNotDone === AIFaction) return {score: 1}
    else if (scoreOrNotDone === faction ) return {score: -1}
    else if (scoreOrNotDone === 'd') return {score: 0}
    else {
        let moves = getAvailableMoves(tiles)
        let scores = moves.map(move =>  {
          let _virtualMove = virtualMove(tiles,move,aiTurn)
          let result = minimax(_virtualMove,!aiTurn).score
          return result
        })
        let maxScore = Math.max.apply(null, scores)
        let minScore = Math.min.apply(null, scores)
        let maxScoreMove = moves[scores.indexOf(maxScore)]
        let minScoreMove = moves[scores.indexOf(minScore)]
        if (aiTurn) { return {score: maxScore, move: maxScoreMove} }
        else { return {score: minScore, move: minScoreMove} }
    }
  }
  // returns all the empty indexes where a move can be made
  getAvailableMoves = (tiles) => {
    return tiles.reduce( (prev,curr,index) => curr==='' ?
    prev.concat(index) : prev ,[])
  }
  // simulates a movement used in the minmax recursion. does not modify the tiles
  virtualMove = (tiles, move, aiTurn) => {
    let _tiles = [...tiles]
    _tiles[move] = aiTurn ? this.state.AIFaction : this.state.faction
    return _tiles
  }
  // @param tiles : board configuration array
  // returns  winner (a, h) , draw (d) or none (n)
  checkWinner = (tiles) => {
    let t = tiles
    // return 1, -1 , d or n if not done.
    // ['h', 'h', 'h', 'a', 'a', '', '', '', ''] should return 1 or -1
    let check = (a, b, c) => !!(a + b + c).match(/^(aaa|hhh)$/gi)
    // horizontal check
    if (check(t[0], t[1], t[2])) return t[0]
    if (check(t[3], t[4], t[5])) return t[3]
    if (check(t[6], t[7], t[8])) return t[6]
    // vertical check
    if (check(t[0], t[3], t[6])) return t[0]
    if (check(t[1], t[4], t[7])) return t[1]
    if (check(t[2], t[5], t[8])) return t[2]
    // diagonal check
    if (check(t[0], t[4], t[8])) return t[0]
    if (check(t[2], t[4], t[6])) return t[2]

    // if no match the string length of the array will be nice in which case return d as a draw
    if (t.join('').length === 9) return 'd'
    return 'n'
  }

}
