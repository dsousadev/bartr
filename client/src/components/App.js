import React from 'react';
import NavBar from '../components/NavBar';
import { Link } from 'react-router';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return(
      <div>
        <NavBar/>
        <div style={{textAlign: 'center'}} className='app'>
          {React.cloneElement(this.props.children, this.props)}
        </div>
      </div>
    )
  }
}

export default App;
