import React from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon';
import 'font-awesome/css/font-awesome.css'


const styles = {
  title: {
    cursor: 'pointer',
  },
  bar: {
  },
  github: {
    margin: 12,
  }
}

const AppBarExampleIconButton = (props) => (
  <AppBar
    style={styles.bar}
    title={<span style={styles.title}>{props.title}</span>}
    iconElementLeft={<div></div>}
    iconElementRight={
      <FlatButton
        href={props.href}
        secondary={true}
        icon={<FontIcon className='fa fa-github' hoverColor="#55486E" />}
        style={styles.github}
      />
    }
  />
)

export default AppBarExampleIconButton;
