import React, {Component} from 'react'


let styles = {
  tile : {
    width: '120px',
    height: '120px',
    backgroundColor: 'inherit',
    border: '1px solid #777',
    padding: '0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  }
}

export default class Tile extends Component {
  render () {
    let {position, value , tileClick} = this.props
    return (
      <div className="tile" style={styles.tile}
        onClick={() => tileClick(position)}>
        {this.renderImage(value)}
      </div>
    )
  }
  renderImage = (value) => {
    if (value === 'a') return <img alt="Alliance" style={{height: '120px'}} src="../../images/alliance.png" />
    else if (value === 'h') return <img alt="Horde" style={{height: '120px'}} src="../../images/horde.gif" />
    else return
  }
}
