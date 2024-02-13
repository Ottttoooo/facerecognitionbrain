import React, {Component} from 'react';
import Clarifai from 'clarifai';
import ParticlesBg from 'particles-bg'
import Navigation from './Components/Navigation/Navigaton';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: '8beda274884242239ad68626438f1385'
 });


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    console.log('click');

    app.models.predict('face-detection', this.state.input)
    .then(response => {
      console.log('hi', response)
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })

      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  render(){
    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={50} type="cobweb" bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
         onInputChange={this.onInputChange} 
         onButtonSubmit={this.onButtonSubmit}
        />
        {/* 
                <FaceRecognition />} */}
      </div>
    );
  };
};

export default App;
