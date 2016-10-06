import React, { Component } from 'react'
//import $ from 'jquery'

import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton';

import './App.css'
import Topbar from './components/Topbar'
import Tile from './components/Tile'

export default class App extends Component {

  constructor () {
    super()
    this.state = {
      faction: null,
      tiles : Array(9).fill(''),
      playerTurn: null,
      gameOver: false,
    }
  }

  componentDidMount () {
  }

  render () {

    return (
      <div id='App' className='App'>
        <Topbar
          href={'https://github.com/marcosfede/tic-tac-toe'}
          title={'Tic Tac Wow'}
        />
        <div id='content'>
          <Card id='card' zDepth={2}>
            <CardText id='title'>
              <p>Tic Tac Wow</p>
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
            onClick={() => this.startGame('Alliance')}  />
          <RaisedButton label="Horde"
            onClick={() => this.startGame('Horde')} />
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
    this.setState({faction: faction, playerTurn: faction === "Alliance" ? true : false},
    // AI's turn if player selected Horde
    () => {if (faction === 'Horde') {this.AIMove()} }
    )
  }

  resetGame = () => {
    this.setState({faction: null, playerTurn: null, tiles: Array(9).fill('')})
  }

  tileClick = (position) => {
    let {playerTurn, tiles, faction} = this.state
    if (faction !== null && playerTurn && tiles[position]===''){
      let newTiles = [
        ...tiles.slice(0,position),
        faction,
        ...tiles.slice(position+1)
      ]
      this.setState({playerTurn: false, tiles: newTiles },
      () => this.AIMove())
    }
  }

  gameFinish = () => {
    window.setTimeout(() => this.setState({
      playerTurn: null,
      faction: null,
      tiles: Array(9).fill('')
    }),1000)
  }

  AIMove = () => {
    let {tiles, faction} = this.state
    let AIFaction = faction === 'Alliance' ? 'Horde' : 'Alliance'
    let emptyTilePositions = tiles.reduce( (prev,curr,index) => {
      if (curr==='') return prev.concat(index)
      else return prev
    },[])
    if (emptyTilePositions.length >= 1) {
      // some worker code
      let AITile = emptyTilePositions[Math.floor(Math.random()*emptyTilePositions.length)]
      let AITile = minimax(tiles, emptyTilePositions)
      this.setState({
        tiles: [
          ...tiles.slice(0,AITile),
          AIFaction,
          ...tiles.slice(AITile+1)
        ],
      })
      this.checkBoardState(emptyTilePositions)
    }
    // There are no empty tiles. game must end
    else {
      // game over
      this.setState({
        gameOver: true,
      },this.gameFinish)
    }
  }
  checkBoardState = (emptyTilePositions) => {
    // only one option, after choosing it the game ends
    if (emptyTilePositions.length === 1){
      // check who won
      //
      this.setState({gameOver: true}, this.gameFinish)
    }
    else {
      // game continues
      this.setState({playerTurn: true})
    }
  }
  minimax = (tiles, emptyTilePositions) => {

  }
  getAvailableMoves = (tiles) => {
    return tiles.reduce( (prev,curr,index) => {
      if (curr==='') return prev.concat(index)
      else return prev
    },[])
  }
}
